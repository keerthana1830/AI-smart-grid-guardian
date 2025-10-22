import React from 'react';
import { Achievement } from '../types';

interface AchievementsPageProps {
  allAchievements: Achievement[];
  unlockedAchievements: Achievement[];
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ allAchievements, unlockedAchievements }) => {
  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.some(a => a.id === achievementId);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Achievements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map(ach => (
          <div
            key={ach.id}
            className={`p-6 rounded-lg border flex items-start space-x-4 transition-all duration-300 ${
              isUnlocked(ach.id)
                ? 'bg-gray-100/60 dark:bg-gray-700/60 border-indigo-500'
                : 'bg-gray-200/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className={`text-4xl ${isUnlocked(ach.id) ? '' : 'grayscale'}`}>{ach.icon}</div>
            <div>
              <h2 className={`font-bold text-lg ${isUnlocked(ach.id) ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>
                {ach.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
