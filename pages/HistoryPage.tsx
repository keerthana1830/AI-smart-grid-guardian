import React from 'react';
import { GridEvent } from '../types';

interface HistoryPageProps {
  events: GridEvent[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ events }) => {
  const getIcon = (type: 'fault' | 'clear') => {
    return type === 'fault' ? (
      <span className="text-red-500 dark:text-red-400" title="Fault">⚠️</span>
    ) : (
      <span className="text-green-500 dark:text-green-400" title="Clear">✅</span>
    );
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Event History</h1>
      <div className="overflow-x-auto">
        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">No events have been recorded yet.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs text-indigo-700 dark:text-indigo-300 uppercase bg-gray-100 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Timestamp</th>
                <th scope="col" className="px-6 py-3">Message</th>
                <th scope="col" className="px-6 py-3 text-center">Light ID</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-6 py-4 text-center">{getIcon(event.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.timestamp.toLocaleString()}</td>
                  <td className="px-6 py-4">{event.message}</td>
                  <td className="px-6 py-4 text-center font-mono">{event.lightId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
