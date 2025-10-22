import React from 'react';
import { Achievement } from '../types';

interface AchievementsToastProps {
  achievement: Achievement;
}

const AchievementsToast: React.FC<AchievementsToastProps> = ({ achievement }) => {
  return (
    <div className="fixed top-5 right-5 bg-white dark:bg-gray-800 border border-indigo-500 shadow-lg rounded-lg p-4 flex items-center space-x-4 z-50 animate-slide-in">
      <span className="text-3xl">{achievement.icon}</span>
      <div>
        <h3 className="font-bold text-indigo-500 dark:text-indigo-300">Achievement Unlocked!</h3>
        <p className="text-gray-800 dark:text-white">{achievement.name}</p>
      </div>
    </div>
  );
};

export default AchievementsToast;
