let audioContext: AudioContext | null = null;
let isInitialized = false;

/**
 * Initializes the Web Audio API context.
 * This MUST be called as a result of a user gesture (e.g., a click).
 * @returns {boolean} - True if initialization is successful or was already done, false otherwise.
 */
export const initAudio = (): boolean => {
  if (isInitialized || typeof window === 'undefined') {
    return true;
  }
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // If context is suspended, it needs to be resumed.
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    isInitialized = true;
    console.log('Audio context initialized successfully.');
    return true;
  } catch (e) {
    console.error("Could not initialize Web Audio API", e);
    isInitialized = false;
    return false;
  }
};

const playNote = (
  frequency: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine'
) => {
  if (!isInitialized || !audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  
  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

/**
 * Plays a sound effect for a fault event.
 */
export const playFaultSound = () => {
  if (!isInitialized || !audioContext) return;
  // A low, short, buzzing sound to indicate an error/fault
  playNote(120, audioContext.currentTime, 0.2, 0.1, 'sawtooth');
};

/**
 * Plays a sound effect for a fault clearance event.
 */
export const playClearSound = () => {
  if (!isInitialized || !audioContext) return;
  // A higher-pitched, clean sound to indicate success/clearance
  playNote(440, audioContext.currentTime, 0.15, 0.15, 'sine');
  playNote(880, audioContext.currentTime, 0.15, 0.05, 'sine'); // Add a harmonic
};

/**
 * Plays a sound effect for unlocking an achievement.
 */
export const playAchievementSound = () => {
  if (!isInitialized || !audioContext) return;
  const now = audioContext.currentTime;
  // A pleasant, ascending three-note chime
  playNote(523.25, now, 0.1, 0.1, 'triangle'); // C5
  playNote(659.25, now + 0.12, 0.1, 0.1, 'triangle'); // E5
  playNote(783.99, now + 0.24, 0.15, 0.1, 'triangle'); // G5
};
