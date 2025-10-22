import React from 'react';
import { Light, GridEvent, Achievement, HighScore, Theme } from '../types';

import Header from '../components/Header';
import LightGrid from '../components/LightGrid';
import EventLog from '../components/EventLog';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AIAssistant from '../components/AIAssistant';
import Leaderboard from '../components/Leaderboard';
import PowerGridVisualization from '../components/PowerGridVisualization';

interface DashboardPageProps {
  lights: Light[];
  events: GridEvent[];
  score: number;
  level: number;
  unlockedAchievements: Achievement[];
  streak: number;
  highScores: HighScore[];
  isHardwareConnected: boolean;
  theme: Theme;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  lights,
  events,
  score,
  level,
  unlockedAchievements,
  streak,
  highScores,
  isHardwareConnected,
  theme,
}) => {
  return (
    <div className="animate-fade-in">
      <Header score={score} level={level} achievements={unlockedAchievements} streak={streak} />
      
      <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PowerGridVisualization lights={lights} isHardwareConnected={isHardwareConnected} />
          <LightGrid lights={lights} isHardwareConnected={isHardwareConnected} />
          <AIAssistant events={events} isHardwareConnected={isHardwareConnected} />
        </div>
        <div className="space-y-8">
          <AnalyticsDashboard events={events} lights={lights} theme={theme} />
          <EventLog events={events} />
          <Leaderboard highScores={highScores} currentScore={score} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
