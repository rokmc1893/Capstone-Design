import type {
  BingeStatus,
  DrinkStatus,
  FemaleConditions,
  MaleConditions,
  SmokeStatus,
} from '../store/useSimulatorStore';

/** UI 성별 → API `POST /tests/start` (`Start.gender`: M | F) */
export function toApiGender(gender: 'male' | 'female'): 'M' | 'F' {
  return gender === 'male' ? 'M' : 'F';
}

/** API 세션 성별 → UI */
export function fromApiGender(gender: string | undefined): 'male' | 'female' | null {
  if (!gender) return null;
  const g = gender.trim().toUpperCase();
  if (g === 'M' || g === 'MALE') return 'male';
  if (g === 'F' || g === 'FEMALE') return 'female';
  return null;
}

/**
 * PATCH `/tests/{sessionId}/step/male` — 백엔드·AI가 인식하는 한글 (완전 일치).
 * 띄어쓰기·기호 하나만 달라도 0(비흡연·비음주)으로 처리됨.
 */
export const API_SMOKE_LABELS: Record<SmokeStatus, string> = {
  none: '안 피움',
  sometimes: '가끔 피움',
  daily: '매일 피움',
};

export const API_DRINK_LABELS: Record<DrinkStatus, string> = {
  none: '안 마심',
  monthly1to3: '월 1~3회',
  weeklyOrMore: '주 1회 이상',
};

export const API_BINGE_LABELS: Record<BingeStatus, string> = {
  none: '없음',
  monthly1: '월 1회',
  weeklyOrMore: '주 1회 이상',
};

/** 구버전·Swagger 실수로 보낸 영문 enum → UI store (세션 복구용) */
const LEGACY_SMOKE: Record<string, SmokeStatus> = {
  NEVER: 'none',
  OCCASIONAL: 'sometimes',
  DAILY: 'daily',
};

const LEGACY_DRINK: Record<string, DrinkStatus> = {
  NEVER: 'none',
  MONTHLY_1_TO_3: 'monthly1to3',
  WEEKLY_OR_MORE: 'weeklyOrMore',
};

const LEGACY_BINGE: Record<string, BingeStatus> = {
  NEVER: 'none',
  MONTHLY_1: 'monthly1',
  WEEKLY_OR_MORE: 'weeklyOrMore',
};

export function toApiSmokeStatus(status: SmokeStatus): string {
  return API_SMOKE_LABELS[status];
}

export function toApiDrinkStatus(status: DrinkStatus): string {
  return API_DRINK_LABELS[status];
}

export function toApiBingeStatus(status: BingeStatus): string {
  return API_BINGE_LABELS[status];
}

export function fromApiSmokeStatus(value: string | null | undefined): SmokeStatus | null {
  if (!value) return null;
  const v = value.trim();
  const hit = (Object.entries(API_SMOKE_LABELS) as [SmokeStatus, string][]).find(
    ([, label]) => label === v,
  );
  if (hit) return hit[0];
  return LEGACY_SMOKE[v.toUpperCase()] ?? null;
}

export function fromApiDrinkStatus(value: string | null | undefined): DrinkStatus | null {
  if (!value) return null;
  const v = value.trim();
  const hit = (Object.entries(API_DRINK_LABELS) as [DrinkStatus, string][]).find(
    ([, label]) => label === v,
  );
  if (hit) return hit[0];
  return LEGACY_DRINK[v.toUpperCase()] ?? null;
}

export function fromApiBingeStatus(value: string | null | undefined): BingeStatus | null {
  if (!value) return null;
  const v = value.trim();
  const hit = (Object.entries(API_BINGE_LABELS) as [BingeStatus, string][]).find(
    ([, label]) => label === v,
  );
  if (hit) return hit[0];
  return LEGACY_BINGE[v.toUpperCase()] ?? null;
}

/** 수면 시간(소수 시간) → API sleepHours + sleepMinutes */
export function splitSleepHours(totalHours: number): {
  sleepHours: number;
  sleepMinutes: number;
} {
  const safe = Math.max(0, Math.min(24, totalHours));
  let sleepHours = Math.floor(safe);
  let sleepMinutes = Math.round((safe - sleepHours) * 60);
  if (sleepMinutes >= 60) {
    sleepHours += 1;
    sleepMinutes = 0;
  }
  if (sleepHours >= 24) {
    return { sleepHours: 24, sleepMinutes: 0 };
  }
  return { sleepHours, sleepMinutes };
}

export function maleConditionFlags(c: MaleConditions): { chlam: number; gon: number } {
  return {
    chlam: c.chlam ? 1 : 0,
    gon: c.gon ? 1 : 0,
  };
}

export function femaleConditionFlags(c: FemaleConditions): {
  pcos: number;
  endo: number;
  uf: number;
  pid: number;
  chlam: number;
  gon: number;
} {
  return {
    pcos: c.pcos ? 1 : 0,
    endo: c.endo ? 1 : 0,
    uf: c.uf ? 1 : 0,
    pid: c.pid ? 1 : 0,
    chlam: c.chlam ? 1 : 0,
    gon: c.gon ? 1 : 0,
  };
}

export function pssAnswersFromStore(
  answers: Array<number | null | undefined>,
): number[] {
  return answers.map((a) => (a === null || a === undefined ? 0 : a));
}
