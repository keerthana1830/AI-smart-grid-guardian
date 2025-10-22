
import { Light, LightState, Achievement } from './types';

export const NUM_LIGHTS = 3;
export const SIMULATION_INTERVAL = 8000; // ms
export const FAULT_DURATION = 3000; // ms
export const MAX_EVENTS = 50;

export const LEADERBOARD_KEY = 'smartGridLeaderboard';
export const MAX_LEADERBOARD_ENTRIES = 5;

export const INITIAL_LIGHTS: Light[] = Array.from({ length: NUM_LIGHTS }, (_, i) => ({
  id: i + 1,
  state: LightState.OK,
}));

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_clear',
    name: 'First Response',
    description: 'Successfully cleared your first fault.',
    icon: '🛡️',
    condition: (_, __, clearedCount) => clearedCount >= 1,
  },
  {
    id: 'ten_clears',
    name: 'Grid Operator',
    description: 'Successfully cleared 10 faults.',
    icon: '⚙️',
    condition: (_, __, clearedCount) => clearedCount >= 10,
  },
  {
    id: 'score_1000',
    name: 'Point Collector',
    description: 'Reach a score of 1000.',
    icon: '⭐',
    condition: (score) => score >= 1000,
  },
    {
    id: 'score_5000',
    name: 'High Scorer',
    description: 'Reach a score of 5000. Impressive!',
    icon: '🏆',
    condition: (score) => score >= 5000,
  },
];