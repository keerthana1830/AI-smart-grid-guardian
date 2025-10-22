import React from 'react';

interface HardwareStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  onToggle: () => void;
  baudRate: number;
  onBaudRateChange: (rate: number) => void;
}

const HardwareStatus: React.FC<HardwareStatusProps> = ({ isConnected, isConnecting, onToggle, baudRate, onBaudRateChange }) => {
  const statusDotClass = isConnecting
    ? 'bg-yellow-500 animate-pulse'
    : isConnected
    ? 'bg-green-500 animate-pulse'
    : 'bg-red-500';

  const statusText = isConnecting
    ? 'Connecting...'
    : isConnected
    ? 'Hardware Connected'
    : 'Hardware Disconnected';

  const buttonText = isConnecting
    ? 'Connecting...'
    : isConnected
    ? 'Disconnect'
    : 'Connect';

  const buttonClass = isConnecting
    ? 'bg-gray-500 cursor-not-allowed'
    : isConnected
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';

  const commonBaudRates = [9600, 19200, 38400, 57600, 115200];

  return (
    <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className={`w-3 h-3 rounded-full ${statusDotClass}`}></span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {statusText}
        </span>
      </div>
      
      <select
        value={baudRate}
        onChange={(e) => onBaudRateChange(parseInt(e.target.value, 10))}
        disabled={isConnected || isConnecting}
        className="text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200"
        aria-label="Select baud rate"
      >
        {commonBaudRates.map(rate => (
          <option key={rate} value={rate}>{rate}</option>
        ))}
      </select>

      <button
        onClick={onToggle}
        disabled={isConnecting}
        className={`px-3 py-1 text-xs font-bold text-white rounded-md transition-colors ${buttonClass}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default HardwareStatus;