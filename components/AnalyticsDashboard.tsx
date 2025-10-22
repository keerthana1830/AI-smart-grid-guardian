import React, { useMemo } from 'react';
import { GridEvent, Light, Theme } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface AnalyticsDashboardProps {
  events: GridEvent[];
  lights: Light[];
  theme: Theme;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ events, lights, theme }) => {
  const faultCounts = lights.map(light => ({
    name: `Light ${light.id}`,
    faults: events.filter(e => e.type === 'fault' && e.lightId === light.id).length,
  }));

  const totalFaults = events.filter(e => e.type === 'fault').length;
  const uptimePercentage = totalFaults === 0 ? 100 : ((events.filter(e => e.type === 'clear').length) / totalFaults) * 100;

  const faultTrendData = useMemo(() => {
    const faultEvents = events.filter(e => e.type === 'fault');
    const sortedFaults = [...faultEvents].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return sortedFaults.map((event, index) => ({
      time: event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      'Cumulative Faults': index + 1,
    }));
  }, [events]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  const tickColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
  const tooltipBg = theme === 'dark' ? '#1f2937' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#4b5563' : '#d1d5db';
  const tooltipText = theme === 'dark' ? '#e5e7eb' : '#374151';

  return (
    <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Performance Analytics</h2>
        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalFaults}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Faults</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalFaults > 0 ? uptimePercentage.toFixed(1) : '100'}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-500 dark:text-gray-400">Faults by Light</h3>
        <div className="w-full h-48">
          <ResponsiveContainer>
            <BarChart data={faultCounts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: tickColor }} fontSize={12} />
              <YAxis allowDecimals={false} tick={{ fill: tickColor }} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  color: tooltipText,
                }}
              />
              <Bar dataKey="faults">
                {faultCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-500 dark:text-gray-400">Fault Trend Over Time</h3>
        <div className="w-full h-48">
          <ResponsiveContainer>
            <LineChart data={faultTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4b5563' : '#e5e7eb'} />
              <XAxis dataKey="time" tick={{ fill: tickColor }} fontSize={12} />
              <YAxis allowDecimals={false} tick={{ fill: tickColor }} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                }}
                labelStyle={{ color: tooltipText }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', color: tickColor }} />
              <Line type="monotone" dataKey="Cumulative Faults" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
