import React from 'react';
import { Page, Theme } from '../types';
import HardwareStatus from './HardwareStatus';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  user: string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  activePage: Page;
  isHardwareConnected: boolean;
  isConnecting: boolean;
  onToggleHardware: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  baudRate: number;
  onBaudRateChange: (rate: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, activePage, isHardwareConnected, isConnecting, onToggleHardware, theme, onToggleTheme, baudRate, onBaudRateChange }) => {
  const navLinks: { page: Page; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'achievements', label: 'Achievements' },
    { page: 'history', label: 'History' },
    { page: 'rewards', label: 'Rewards' },
    { page: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="text-gray-800 dark:text-white">
        Welcome, <span className="font-bold text-indigo-600 dark:text-indigo-400">{user}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {navLinks.map(({ page, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === page ? 'nav-link-active' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <HardwareStatus 
            isConnected={isHardwareConnected} 
            isConnecting={isConnecting} 
            onToggle={onToggleHardware}
            baudRate={baudRate}
            onBaudRateChange={onBaudRateChange}
        />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;