/** 백엔드 `GET /home` — `result.user` */
export type HomeUserDto = {
  nickname?: string;
  level?: number;
  exp?: number;
};

export type HomeRecentTestDto = {
  resultId?: number;
  score?: number;
  riskLevel?: string;
};

export type HomeActionType = 'TEST' | 'BODY_STATUS' | 'GUIDE' | 'SETTINGS';

export type HomeActionDto = {
  type?: HomeActionType | string;
  title?: string;
};

export type HomeDashboardDto = {
  user?: HomeUserDto;
  recentTest?: HomeRecentTestDto | null;
  todayMissions?: TodayMissionDto[];
  unreadNotiCount?: number;
  actions?: HomeActionDto[];
};

export type TestSessionStartResult = {
  sessionId: string;
};

export type TestSessionSubmitResult = {
  resultId: number;
  aiScore?: number;
  riskProbability?: number;
  riskLevel?: string;
  topFactors?: string[];
};

export type TodayMissionDto = {
  missionId?: number;
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  completed?: boolean;
  completedAt?: string | null;
};

export type MissionsTodayResultDto = {
  total?: number;
  missions?: TodayMissionDto[];
};

export type MissionCompleteResponseDto = {
  missionId?: number;
  expGained?: number;
  currentExp?: number;
  currentLevel?: number;
  requiredExpForCurrentLevel?: number;
  isLevelUp?: boolean;
  alreadyCompleted?: boolean;
  dailyRewardCapReached?: boolean;
  /** `PEONY` | `BABYS_BREATH` | `LOTUS` 또는 null */
  newFlower?: string | null;
};

export type MissionHistoryLogDto = {
  date?: string;
  action?: string;
  expChange?: string;
};

export type MissionHistoryPageDto = {
  items?: MissionHistoryLogDto[];
  nextLastLogId?: number | null;
};

export type FlowerCollectionEntryDto = {
  flowerType?: string;
  achievedAt?: string;
};

export type UserMeDto = {
  userId?: number;
  nickname?: string;
  profileImageUrl?: string | null;
  isTermsAgreed?: boolean;
};

export type ResultsHistoryItemDto = {
  resultId?: number;
  sessionId?: number;
  aiScore?: number;
  riskLevel?: string;
  topFactors?: string[];
  createdAt?: string;
};

export type ResultsHistoryResultDto = {
  year?: number;
  month?: number;
  items?: ResultsHistoryItemDto[];
};
