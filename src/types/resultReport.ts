export type ResultRiskLevel = 'SAFE' | 'WARNING' | 'DANGER';

export type ResultFactorCategory =
  | 'SMOKING'
  | 'DRINKING'
  | 'SLEEP'
  | 'EXERCISE'
  | 'DISEASE'
  | 'AGE'
  | 'WEIGHT'
  | 'OTHER';

export type MissionFrequencyType = 'DAILY' | 'WEEKLY';

export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ResultReportIntro = {
  greeting: string;
  scoreMessage: string;
  comfortMessage: string;
};

export type ResultReportCondition = {
  sleepLabel: string;
  stressLabel: string;
  summary: string;
};

export type ResultFactorAnalysis = {
  factor: string;
  category: ResultFactorCategory;
  mateThought: string;
  expectedChange: string;
};

export type ResultMissionFrequency = {
  type: MissionFrequencyType;
  count: number;
  unit: string;
};

export type ResultMissionDuration = {
  value?: number;
  unit?: string;
};

export type ResultMission = {
  title: string;
  description: string;
  linkedFactor: string;
  category: ResultFactorCategory;
  frequency: ResultMissionFrequency;
  duration: ResultMissionDuration;
  difficulty: MissionDifficulty;
  userAdjustable: boolean;
};

export type ResultReport = {
  resultId: number;
  nickname: string;
  age: number;
  gender: '남성' | '여성';
  score: number;
  riskLevel: ResultRiskLevel;
  intro: ResultReportIntro;
  condition: ResultReportCondition;
  factorAnalyses: ResultFactorAnalysis[];
  missions: ResultMission[];
  closing: string;
};
