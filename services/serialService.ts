// Fix: Add type definitions for the Web Serial API to resolve TypeScript errors.
// These types are not included by default and are necessary for navigator.serial.
declare global {
  interface SerialPort {
    open(options: { baudRate: number }): Promise<void>;
    close(): Promise<void>;
    readonly readable: ReadableStream<Uint8Array> | null;
  }

  interface Serial {
    requestPort(options?: any): Promise<SerialPort>;
  }

  interface Navigator {
    serial: Serial;
  }
}

import { HardwareUpdate, LightState } from "../types";

let port: SerialPort | undefined;
let reader: ReadableStreamDefaultReader<string> | undefined;
let keepReading = false;
let readableStreamClosed: Promise<void> | undefined;
let onDisconnectCallback: ((message?: string) => void) | null = null;
let isCleaningUp = false;

/**
 * A centralized function to gracefully shut down and clean up all serial resources.
 * This prevents race conditions and ensures a clean state for the next connection.
 */
async function cleanupSerial() {
    if (isCleaningUp) {
        console.log("Cleanup already in progress.");
        return;
    }
    isCleaningUp = true;

    // Signal the read loop to stop.
    keepReading = false;

    // Cancel the reader to unblock any pending read() call. This will cause an error that's caught in the loop.
    if (reader) {
        try {
            await reader.cancel();
        } catch (error) {
            // This is expected and normal during a disconnect.
            console.warn("Error cancelling reader (expected on disconnect).", error);
        }
    }

    // Wait for the stream piping to finish before closing the port.
    if (readableStreamClosed) {
        await readableStreamClosed.catch(() => { /* This promise may reject on cancellation, ignore it. */ });
    }

    // Close the port itself.
    if (port) {
        try {
            await port.close();
            console.log("Serial port successfully closed.");
        } catch (e) {
            console.warn("Failed to close port, it might have been disconnected already.", e);
        }
    }

    // Reset all state variables for a clean slate.
    port = undefined;
    reader = undefined;
    readableStreamClosed = undefined;
    onDisconnectCallback = null;
    isCleaningUp = false;
}

/**
 * Handles unexpected disconnections or read errors by notifying the UI
 * and then triggering a full cleanup.
 * @param message - An optional error message to pass to the UI.
 */
function handleCommunicationError(message?: string) {
    if (onDisconnectCallback) {
        onDisconnectCallback(message);
    }
    // Fire-and-forget the cleanup process.
    cleanupSerial();
}

export async function connectSerial(onData: (data: HardwareUpdate) => void, onDisconnect: (message?: string) => void, baudRate: number): Promise<boolean> {
    // Proactively clean up any stale connection state before attempting a new one.
    if (port || isCleaningUp) {
        console.warn("A port object exists or cleanup is in progress. Forcing disconnect before reconnecting.");
        await cleanupSerial();
    }

    if ('serial' in navigator) {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate });
            keepReading = true;
            onDisconnectCallback = onDisconnect;
            console.log(`Serial port connected at ${baudRate} baud.`);
            // Do not await readLoop, let it run in the background.
            readLoop(onData);
            return true;
        } catch (err) {
            if (err instanceof DOMException && err.name === 'NotFoundError') {
                console.log("Port selection cancelled by user.");
                port = undefined;
                return false;
            }
            
            const errorMessage = `Could not connect to the hardware.

This is often because:
- The device is in use by another program (like the Arduino IDE's Serial Monitor).
- The device was disconnected during the connection attempt.
- There's a driver issue with your device.

Please close any other programs using the port, check your connection, and try again.`;

            console.error("There was an error opening the serial port:", err);
            // Ensure cleanup runs even on a failed connection attempt.
            await cleanupSerial();
            throw new Error(errorMessage);
        }
    } else {
        console.error("Web Serial API not supported by this browser.");
        alert("Web Serial API is not supported by your browser. Please use a compatible browser like Chrome or Edge.");
        return false;
    }
}

export async function disconnectSerial() {
    await cleanupSerial();
}

async function readLoop(onData: (data: HardwareUpdate) => void) {
    if (!port || !port.readable) {
        return;
    }
    
    const textDecoder = new TextDecoderStream();
    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    let lineBuffer = '';

    while (port.readable && keepReading) {
        try {
            const { value, done } = await reader.read();
            if (done) {
                // This branch is reached when the stream is successfully closed via reader.cancel().
                break;
            }
            
            lineBuffer += value;
            
            let newlineIndex;
            while ((newlineIndex = lineBuffer.indexOf('\n')) !== -1) {
                const line = lineBuffer.slice(0, newlineIndex).trim();
                lineBuffer = lineBuffer.slice(newlineIndex + 1);

                if (line) {
                    const update = parseLine(line);
                    if (update) {
                        onData(update);
                    }
                }
            }
        } catch (error) {
            // If keepReading is true, it's an unexpected error.
            // If false, it's a planned disconnect.
            if (keepReading) {
                const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
                const isFramingError = (error instanceof DOMException && error.name === 'BreakError') || errorMessage.includes('framing');

                if (isFramingError) {
                    console.error("Serial read error detected: Framing, parity, or buffer overrun error. This likely indicates a baud rate mismatch.", error);
                    handleCommunicationError("A hardware communication error occurred (Framing Error). This usually means the selected baud rate is incorrect. Please select the correct baud rate for your device and try connecting again.");
                } else {
                    console.error("Error reading from serial port (unexpected disconnect?):", error);
                    handleCommunicationError(); // Default message for other errors
                }
            } else {
                console.log("Read loop cancelled as part of a normal disconnect.");
            }
            // In either case, break the loop. The cleanup is handled by disconnectSerial or handleCommunicationError.
            break; 
        }
    }
    // The reader lock is released automatically when the stream is cancelled or closed.
    // No need for reader.releaseLock() if we always cancel.
}

function parseLine(line: string): HardwareUpdate | null {
  // This flexible regex handles varied sentence structures. It looks for "light [ID]" 
  // and a status keyword ('fault', 'clear', 'ok'), regardless of their order or any
  // text that might be in between or around them.
  const match = line.match(/light\s*(\d+).*(fault|clear|ok)|(fault|clear|ok).*light\s*(\d+)/i);

  if (match) {
    // The regex uses an OR, so we check which capture groups were populated.
    // match[1] and match[2] are for the "light...status" order.
    // match[3] and match[4] are for the "status...light" order.
    const lightId = parseInt(match[1] || match[4], 10);
    const statusStr = (match[2] || match[3]).toUpperCase();
    
    // Map the parsed status to our internal LightState enum.
    const state = statusStr === 'FAULT' ? LightState.FAULT : LightState.OK;
    
    if (!isNaN(lightId)) {
      return { lightId, state };
    }
  }

  // If the line doesn't match our expected patterns, we log it for debugging
  // and ignore it, preventing crashes from unexpected serial data.
  console.warn("Received unparseable line from serial:", line);
  return null;
}
