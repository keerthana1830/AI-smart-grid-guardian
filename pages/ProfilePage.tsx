import React from 'react';
import { HighScore } from '../types';

interface ProfilePageProps {
  user: string;
  score: number;
  level: number;
  highScores: HighScore[];
  unlockedAchievementsCount: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, score, level, highScores, unlockedAchievementsCount }) => {
    const highestScore = highScores.length > 0 ? highScores[0].score : score;
  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="text-center">
        <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
          {user.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{user}</h1>
        <p className="text-indigo-600 dark:text-indigo-300">Grid Guardian</p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg">
          <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">CURRENT SCORE</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{score.toLocaleString()}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg">
          <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">LEVEL</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{level}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg">
          <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">ACHIEVEMENTS</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{unlockedAchievementsCount}</div>
        </div>
      </div>
       <div className="mt-6 bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg text-center">
          <div className="text-xs text-indigo-500 dark:text-indigo-300 font-semibold">PERSONAL BEST SCORE</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{highestScore.toLocaleString()}</div>
        </div>
    </div>
  );
};

export default ProfilePage;
