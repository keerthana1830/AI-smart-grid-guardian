import { Reward } from './types';

export const REWARDS: Reward[] = [
  {
    id: 'level_5',
    name: 'Grid Novice',
    description: 'Reach Level 5.',
    icon: '🎓',
    condition: (level, _) => level >= 5,
  },
  {
    id: 'level_10',
    name: 'Grid Adept',
    description: 'Reach Level 10. You\'re getting good at this!',
    icon: '🛠️',
    condition: (level, _) => level >= 10,
  },
  {
    id: 'level_20',
    name: 'Grid Expert',
    description: 'Reach Level 20. A true professional.',
    icon: '🌟',
    condition: (level, _) => level >= 20,
  },
  {
    id: 'clear_25',
    name: 'Quick Responder',
    description: 'Clear 25 faults.',
    icon: '⚡',
    condition: (_, clearedCount) => clearedCount >= 25,
  },
  {
    id: 'clear_50',
    name: 'Veteran Operator',
    description: 'Clear 50 faults.',
    icon: '🎖️',
    condition: (_, clearedCount) => clearedCount >= 50,
  },
  {
    id: 'clear_100',
    name: 'System Guardian',
    description: 'Clear 100 faults. The grid is safe in your hands.',
    icon: '🛡️',
    condition: (_, clearedCount) => clearedCount >= 100,
  },
];