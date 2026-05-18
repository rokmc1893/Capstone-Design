import type {
  BingeStatus,
  DrinkStatus,
  FemaleConditions,
  MaleConditions,
  SmokeStatus,
} from '../store/useSimulatorStore';

/** UI 성별 → API `POST /tests/start` */
export function toApiGender(gender: 'male' | 'female'): 'MALE' | 'FEMALE' {
  return gender === 'male' ? 'MALE' : 'FEMALE';
}

export function toApiSmokeStatus(status: SmokeStatus): string {
  if (status === 'none') return 'NEVER';
  if (status === 'sometimes') return 'OCCASIONAL';
  return 'DAILY';
}

export function toApiDrinkStatus(status: DrinkStatus): string {
  if (status === 'none') return 'NEVER';
  if (status === 'monthly1to3') return 'MONTHLY_1_TO_3';
  return 'WEEKLY_OR_MORE';
}

export function toApiBingeStatus(status: BingeStatus): string {
  if (status === 'none') return 'NEVER';
  if (status === 'monthly1') return 'MONTHLY_1';
  return 'WEEKLY_OR_MORE';
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
