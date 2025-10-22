import React from 'react';
import { Achievement } from '../types';

interface HeaderProps {
  score: number;
  level: number;
  achievements: Achievement[];
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ score, level, achievements, streak }) => {
  const levelProgress = ((score % 500) / 500) * 100;

  return (
    <header className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
          AI Smart Grid Guardian
        </h1>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="text-center">
            <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">SCORE</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">LEVEL</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{level}</div>
          </div>
           <div className="text-center">
            <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">STREAK</div>
            <div key={streak} className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center animate-fade-in">
              <span>🔥</span>
              <span className="ml-1">{streak}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {achievements.map(ach => (
              <div key={ach.id} className="group relative">
                <span className="text-2xl cursor-pointer">{ach.icon}</span>
                <div className="absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-gray-700 shadow-lg">
                  <p className="font-bold">{ach.name}</p>
                  <p>{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${levelProgress}%` }}>
        </div>
      </div>
    </header>
  );
};

export default Header;
