import React from 'react';
import { HighScore } from '../types';

interface LeaderboardProps {
  highScores: HighScore[];
  currentScore: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ highScores, currentScore }) => {
  const rankDisplay = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">🏆 Top Scores</h2>
      {highScores.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-4">Be the first to set a high score!</p>
      ) : (
        <ol className="space-y-3">
          {highScores.map((entry, index) => {
            const isCurrentPlayer = entry.score === currentScore && currentScore > 0;
            return (
              <li
                key={index}
                className={`flex justify-between items-center p-2 rounded-md transition-colors ${isCurrentPlayer ? 'bg-indigo-500/40 border border-indigo-500' : 'bg-gray-100 dark:bg-gray-700/50'}`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-lg w-8 text-center">{rankDisplay(index)}</span>
                  <span className={`font-semibold ${isCurrentPlayer ? 'text-indigo-300' : 'text-gray-800 dark:text-white'}`}>{entry.score.toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
