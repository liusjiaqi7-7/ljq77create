export enum GameState {
  DASHBOARD = 'DASHBOARD',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY'
}

export interface Level {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Novice' | 'Adept' | 'Expert';
  xpReward: number;
  locked: boolean;
  missionObjective: string;
  starterCode: string;
  hints: string[];
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  completedLevels: number[];
}

export interface CodeValidationResult {
  correct: boolean;
  feedback: string;
  output: string;
}

export interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
}