/** 백엔드 `GET /home` — `result.user` */
export type HomeUserDto = {
  nickname?: string;
  level?: number;
  exp?: number;
  dailyRewardCapReached?: boolean;
  /** 서버 새싹 꽃 종류 (`PEONY` 등) */
  flowerType?: string;
  currentFlowerType?: string;
};

/** `GET /home` — `result.recentTest` */
export type HomeRecentTestDto = {
  resultId?: number;
  score?: number;
  riskLevel?: string;
  topFactors?: string[];
  createdAt?: string;
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
  dailyRewardCapReached?: boolean;
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
  dailyRewardCapReached?: boolean;
};

export type MissionsTodayPayload = {
  missions: TodayMissionDto[];
  dailyRewardCapReached?: boolean;
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
  /** `PEONY` | `BABYS_BREATH` | `LOTUS` 또는 null — 개화(보관함 추가) 시 */
  newFlower?: string | null;
  /** 레벨 5 달성 중·개화 전 현재 키우는 꽃 */
  currentFlowerType?: string | null;
  flowerType?: string | null;
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

export type UserMeGender = 'M' | 'F' | 'MALE' | 'FEMALE';

/** `GET /users/me` · `PATCH /users/me` 응답 (`UserInfoDTO`) */
export type UserMeDto = {
  userId?: number;
  nickname?: string;
  /** 홈 인사말용 표시 이름 (1~20자) */
  displayName?: string | null;
  profileImageUrl?: string | null;
  gender?: UserMeGender | string | null;
  isTermsAgreed?: boolean;
};

/** `PATCH /users/me` 요청 (`UpdateProfileDTO`) */
export type UpdateProfileDto = {
  nickname?: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
  gender?: UserMeGender | string;
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
