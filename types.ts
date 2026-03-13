export interface UserProfile {
  name: string;
  role: string;
  experienceYears: number;
  goals: string[];
  skills: Skill[];
  iqScore?: number;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  type: 'hard' | 'soft';
}

export interface Question {
  id: number;
  domain: 'Logic' | 'Verbal' | 'Pattern' | 'Math';
  text: string;
  options: string[];
  correctIndex: number;
}

export interface AssessmentResult {
  totalScore: number;
  breakdown: Record<string, number>;
  completedAt: string;
}

export interface MarketTrend {
  skill: string;
  demand: 'High' | 'Medium' | 'Low';
  growth: number; // percentage
  relevanceScore: number; // 0-100 match to user
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'Course' | 'Project' | 'Article';
  provider: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  ASSESSMENT = 'assessment',
  RESUME = 'resume',
  MARKET = 'market',
  SETTINGS = 'settings',
}