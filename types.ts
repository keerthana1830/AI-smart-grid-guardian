export enum LightState {
  OK = 'OK',
  FAULT = 'FAULT',
  PENDING = 'PENDING',
}

export interface Light {
  id: number;
  state: LightState;
}

export interface GridEvent {
  id: number;
  timestamp: Date;
  message: string;
  lightId: number;
  type: 'fault' | 'clear';
}

export interface Achievement {
  id: string;
  name:string;
  description: string;
  icon: string;
  condition: (score: number, faultCount: number, clearedCount: number) => boolean;
}

export interface HighScore {
  score: number;
  date: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (level: number, clearedCount: number) => boolean;
}

export interface HardwareUpdate {
  lightId: number;
  state: LightState;
}

export type Page = 'login' | 'dashboard' | 'achievements' | 'history' | 'profile' | 'rewards';

export type Theme = 'light' | 'dark';