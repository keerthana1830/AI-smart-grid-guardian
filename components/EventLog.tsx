import React from 'react';
import { GridEvent } from '../types';

interface EventLogProps {
  events: GridEvent[];
}

const EventLog: React.FC<EventLogProps> = ({ events }) => {
  const getIcon = (type: 'fault' | 'clear') => {
    return type === 'fault' ? (
      <span className="text-red-500 dark:text-red-400">⚠️</span>
    ) : (
      <span className="text-green-500 dark:text-green-400">✅</span>
    );
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-96">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Event Log</h2>
      <div className="overflow-y-auto h-full pr-2 space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">No events yet. Monitoring...</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="text-sm flex items-start">
              <div className="mr-3 mt-1">{getIcon(event.type)}</div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">{event.message}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventLog;
