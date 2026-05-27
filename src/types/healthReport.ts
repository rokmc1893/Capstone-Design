/**
 * 검사 상세 리포트 화면 모델 — `GET /api/results/{resultId}` 정규화 후 `healthRecordFromResultReport`로 변환
 * (필드명은 백엔드와 camelCase로 맞춤; snake_case 응답이면 normalize 단계에서 변환)
 */
import type { ResultQuestionnaireGroup } from './resultReport';

export type HealthRecordGender = 'male' | 'female';

export type HealthComparisonStatus = 'High' | 'Low' | 'Normal';

export type HealthRecordInputData = {
  age: number | null;
  height: number | null;
  weight: number | null;
  smoking: string;
  drinking: string;
  sleep: string;
  sexualActivity?: string;
  firstPeriodAge?: number;
  pregnancyExperience?: string;
};

export type HealthComparisonRow = {
  label: string;
  myValue: string;
  avgValue: string;
  result: string;
  status: HealthComparisonStatus;
};

/** 핵심 리스크 카드 — 검사 결과 `factorAnalyses` 기반 */
export type HealthFactorCard = {
  factor: string;
  insight: string;
  expectedChange: string;
};

/** 미리 보는 미션 가이드 한 줄 */
export type HealthMissionPreview = {
  title: string;
  description: string;
};

export type HealthRecord = {
  id: string;
  /** `GET /api/results/{resultId}` PK — 다른 검사일로 이동 시 사용 */
  resultId?: number;
  date: string;
  year: number;
  month: number;
  week: number;
  /** 화면 총점 (0~100, 서버 산정) */
  score: number;
  pssScore: number | null;
  gender: HealthRecordGender;
  inputData: HealthRecordInputData;
  questionnaireGroups: ResultQuestionnaireGroup[];
  comparisonTable: HealthComparisonRow[];
  risks: string[];
  aiNarrative: string;
  guides: string[];
  factorCards?: HealthFactorCard[];
  missionPreviews?: HealthMissionPreview[];
};
