import React from 'react';
import { Light as LightType, LightState } from '../types';

interface PowerGridVisualizationProps {
  lights: LightType[];
  isHardwareConnected: boolean;
}

const PowerGridVisualization: React.FC<PowerGridVisualizationProps> = ({ lights, isHardwareConnected }) => {
  const sourceCoords = { x: 250, y: 50 };
  const lightCoords = [
    { x: 50, y: 200 },
    { x: 250, y: 200 },
    { x: 450, y: 200 },
  ];

  const hasSystemFault = isHardwareConnected && lights.some(l => l.state === LightState.FAULT);

  const getSourceStatusClasses = () => {
    if (!isHardwareConnected) {
      return 'fill-gray-400 dark:fill-gray-600 stroke-gray-500';
    }
    if (hasSystemFault) {
      return 'fill-red-500 stroke-red-400 animate-pulse-node';
    }
    return 'fill-yellow-400 stroke-yellow-300';
  }

  const getStatusClasses = (state: LightState, isConnected: boolean) => {
    if (!isConnected) {
      return {
        line: 'stroke-gray-400 dark:stroke-gray-600',
        node: 'fill-gray-400 dark:fill-gray-600',
        flow: 'hidden',
      };
    }
    switch(state) {
      case LightState.FAULT:
        return {
          line: 'stroke-red-500',
          node: 'fill-red-500 animate-pulse-node',
          flow: 'stroke-red-400/80 animate-flow-fast',
        };
      case LightState.PENDING:
        return {
          line: 'stroke-yellow-500',
          node: 'fill-yellow-500',
          flow: 'stroke-yellow-300/80 animate-flow-normal',
        };
      case LightState.OK:
      default:
        // If there's a fault anywhere in the system, render 'OK' lights as inactive/standby.
        if (hasSystemFault) {
          return {
            line: 'stroke-gray-400 dark:stroke-gray-600',
            node: 'fill-gray-400 dark:fill-gray-600',
            flow: 'hidden',
          };
        }
        return {
          line: 'stroke-blue-500',
          node: 'fill-blue-500',
          flow: 'stroke-blue-300/80 animate-flow-normal',
        };
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Power Grid Flow</h2>
      <div className="w-full aspect-video md:aspect-[2/1] max-h-[250px] transition-opacity duration-500" style={{ opacity: isHardwareConnected ? 1 : 0.5 }}>
        <svg viewBox="0 0 500 250" className="w-full h-full">
          {/* Power Source Node */}
          <g>
            <circle cx={sourceCoords.x} cy={sourceCoords.y} r="20" className={`stroke-2 transition-colors ${getSourceStatusClasses()}`} />
            <text x={sourceCoords.x} y={sourceCoords.y + 35} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs font-semibold uppercase tracking-wider">Source</text>
          </g>

          {lights.map((light, index) => {
            const lCoords = lightCoords[index];
            const status = getStatusClasses(light.state, isHardwareConnected);
            return (
              <g key={light.id}>
                {/* Conduit Line */}
                <line
                  x1={sourceCoords.x}
                  y1={sourceCoords.y}
                  x2={lCoords.x}
                  y2={lCoords.y}
                  className={`stroke-[3] transition-colors ${status.line}`}
                />
                 {/* Animated Flow */}
                 <line
                  x1={sourceCoords.x}
                  y1={sourceCoords.y}
                  x2={lCoords.x}
                  y2={lCoords.y}
                  className={`stroke-[3] stroke-dasharray-[10,15] ${status.flow}`}
                />
                {/* Light Node */}
                <circle cx={lCoords.x} cy={lCoords.y} r="15" className={`stroke-2 stroke-gray-400/50 transition-colors ${status.node}`} />
                 <text x={lCoords.x} y={lCoords.y + 30} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs font-semibold">Light {light.id}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default PowerGridVisualization;