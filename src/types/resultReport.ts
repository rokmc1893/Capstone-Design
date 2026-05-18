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

/** 설문 요약 — 카테고리별 라벨/값 리스트 */
export type ResultQuestionnaireGroup = {
  title: string;
  rows: { label: string; value: string }[];
};

/** 지표 비교 표 한 행 */
export type ResultComparisonTrend = 'higher' | 'lower' | 'neutral';

export type ResultComparisonRow = {
  item: string;
  myValue: string;
  averageValue: string;
  /** 예: "12% 더 높습니다", "약 14% 더 낮습니다" */
  comparisonResult: string;
  trend: ResultComparisonTrend;
};

export type ResultReport = {
  resultId: number;
  nickname: string;
  age: number;
  gender: '남성' | '여성';
  /** 건강 점수 0~100 (백엔드 `GET /api/results/{resultId}` 명세) */
  score: number;
  riskLevel: ResultRiskLevel;
  intro: ResultReportIntro;
  condition: ResultReportCondition;
  factorAnalyses: ResultFactorAnalysis[];
  missions: ResultMission[];
  closing: string;
  /** 서버가 내려주면 우선 사용. 없으면 클라이언트에서 설문 스냅샷으로 생성 */
  questionnaireGroups?: ResultQuestionnaireGroup[];
  comparisonTable?: ResultComparisonRow[];
  coreRiskBullets?: string[];
  /** `GET /api/results/{id}` LLM 분석 (intro·condition·factorAnalyses·missions·closing 포함) */
  personalizedAnalysis?: string;
  /** `GET /api/results/{id}` 행동 가이드 */
  actionGuideBullets?: string[];
  /** 홈·요약용 주요 요인 (서버가 내려주면 우선) */
  topFactors?: { label: string; value: number }[];
};
