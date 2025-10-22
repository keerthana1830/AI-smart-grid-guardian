import React from 'react';
import { Light as LightType, LightState } from '../types';

interface LightProps {
  light: LightType;
  isConnected: boolean;
}

const Light: React.FC<LightProps> = ({ light, isConnected }) => {
  const baseClasses = 'relative w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105';
  
  let stateClasses = '';
  if (!isConnected) {
      stateClasses = 'bg-gray-600/50 shadow-[0_0_10px_2px_rgba(107,114,128,0.4)]';
  } else {
    switch(light.state) {
      case LightState.OK:
        stateClasses = 'bg-green-500/80 shadow-[0_0_15px_5px_rgba(34,197,94,0.6)]';
        break;
      case LightState.FAULT:
        stateClasses = 'bg-red-500/80 shadow-[0_0_15px_5px_rgba(239,68,68,0.6)] animate-pulse';
        break;
      case LightState.PENDING:
        stateClasses = 'bg-yellow-500/80 shadow-[0_0_15px_5px_rgba(234,179,8,0.6)] animate-pulse';
        break;
      default:
        stateClasses = 'bg-gray-500';
    }
  }


  return (
    <div className={`${baseClasses} ${stateClasses}`}>
      <div className="font-bold text-white text-lg z-10">Light {light.id}</div>
      <div className="text-xs text-white/80 font-semibold z-10 uppercase">
        {isConnected ? light.state : 'OFFLINE'}
      </div>
      <div className="absolute inset-0 bg-black/10 rounded-full"></div>
    </div>
  );
};

export default Light;
