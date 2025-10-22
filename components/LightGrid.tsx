import React from 'react';
import { Light as LightType } from '../types';
import Light from './Light';

interface LightGridProps {
  lights: LightType[];
  isHardwareConnected: boolean;
}

const LightGrid: React.FC<LightGridProps> = ({ lights, isHardwareConnected }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-300">Live Grid Status</h2>
      <div className="grid grid-cols-3 gap-6 md:gap-8 justify-items-center">
        {lights.map((light) => (
          <Light key={light.id} light={light} isConnected={isHardwareConnected} />
        ))}
      </div>
    </div>
  );
};

export default LightGrid;
