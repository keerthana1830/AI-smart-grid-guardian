import React from 'react';
import { Reward } from '../types';

interface RewardsPageProps {
  allRewards: Reward[];
  unlockedRewards: Reward[];
}

const RewardsPage: React.FC<RewardsPageProps> = ({ allRewards, unlockedRewards }) => {
  const isUnlocked = (rewardId: string) => {
    return unlockedRewards.some(r => r.id === rewardId);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Operator Rewards</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">Earn these rewards by leveling up and clearing faults to prove your skill as a top Grid Guardian.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRewards.map(reward => (
          <div
            key={reward.id}
            className={`p-6 rounded-lg border flex items-start space-x-4 transition-all duration-300 ${
              isUnlocked(reward.id)
                ? 'bg-gray-100/60 dark:bg-gray-700/60 border-green-500'
                : 'bg-gray-200/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className={`text-4xl ${isUnlocked(reward.id) ? '' : 'grayscale'}`}>{reward.icon}</div>
            <div>
              <h2 className={`font-bold text-lg ${isUnlocked(reward.id) ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                {reward.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;
