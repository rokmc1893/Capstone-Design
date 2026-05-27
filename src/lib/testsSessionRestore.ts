import {
  fromApiBingeStatus,
  fromApiDrinkStatus,
  fromApiGender,
  fromApiSmokeStatus,
} from './testsSessionMappers';
import type {
  BingeStatus,
  DrinkStatus,
  FemaleConditions,
  MaleConditions,
  PssScore,
  SmokeStatus,
} from '../store/useSimulatorStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function shallowCamelKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) out[snakeToCamelKey(k)] = v;
  return out;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toBool(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1 ? true : value === 0 ? false : null;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y', '있음'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n', '없음'].includes(normalized)) return false;
  }
  return null;
}

function pick(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function femaleSmokeCount(rawLevel: number | null): number {
  if (rawLevel == null || rawLevel <= 0) return 0;
  if (rawLevel <= 2) return rawLevel === 1 ? 5 : 15;
  return Math.max(0, Math.round(rawLevel));
}

function femaleDrinkStatusFromAny(
  rawStatus: unknown,
  rawLevel: unknown,
  rawLabel: unknown,
  bingeDaysPerYear: number,
): DrinkStatus {
  const fromStatus = fromApiDrinkStatus(typeof rawStatus === 'string' ? rawStatus : null);
  if (fromStatus) return fromStatus;

  const fromLabel = fromApiDrinkStatus(typeof rawLabel === 'string' ? rawLabel : null);
  if (fromLabel) return fromLabel;

  const level = toNumber(rawLevel);
  if (level === 0) return 'none';
  if (level === 1) return 'monthly1to3';
  if (level === 2) return 'weeklyOrMore';

  if (bingeDaysPerYear <= 0) return 'none';
  if (bingeDaysPerYear <= 11) return 'monthly1to3';
  return 'weeklyOrMore';
}

function restoreFemaleConditions(c: Record<string, unknown>): FemaleConditions {
  const flags: Array<keyof FemaleConditions> = ['pcos', 'endo', 'uf', 'pid', 'chlam', 'gon'];
  const next: FemaleConditions = {
    pcos: false,
    endo: false,
    uf: false,
    pid: false,
    chlam: false,
    gon: false,
    none: false,
  };
  let any = false;
  for (const key of flags) {
    const on = toBool(c[key]) === true;
    next[key] = on;
    if (on) any = true;
  }
  next.none = !any;
  return next;
}

function restoreMaleConditions(c: Record<string, unknown>): MaleConditions {
  const next: MaleConditions = {
    chlam: toBool(c.chlam) === true,
    gon: toBool(c.gon) === true,
    none: false,
  };
  next.none = !next.chlam && !next.gon;
  return next;
}

/**
 * PSS 답변 복구.
 *
 * 백엔드 `GET /tests/{sessionId}` 응답에는 현재 `pssAnswers` 필드가 포함되지 않습니다
 * (PSS는 `POST /tests/{sessionId}/submit` 입력 전용, `stressScore`/`stressLevel`은 submit 후에만 산정).
 * 따라서 새로고침 시 PSS 답변은 사실상 복구되지 않으며, 본 함수는 백엔드가 추후
 * 필드를 추가하거나 `q1~q10` 분해 응답을 보낼 가능성에 대비한 안전망입니다.
 */
function restorePssAnswers(c: Record<string, unknown>): Array<PssScore | null> {
  const raw = pick(c, ['pssAnswers', 'pss']);
  if (Array.isArray(raw)) {
    return Array.from({ length: 10 }, (_, i) => {
      const value = toNumber(raw[i]);
      return value != null && value >= 0 && value <= 4 ? (value as PssScore) : null;
    });
  }

  return Array.from({ length: 10 }, (_, i) => {
    const value = toNumber(c[`q${i + 1}`]);
    return value != null && value >= 0 && value <= 4 ? (value as PssScore) : null;
  });
}

export function restoreInspectionDraftFromSession(
  raw: unknown,
  fallbackGender?: 'male' | 'female',
): boolean {
  const top = asRecord(raw);
  if (!top) return false;
  const c = shallowCamelKeys(top);

  const store = useSimulatorStore.getState();
  const gender = fromApiGender(typeof c.gender === 'string' ? c.gender : undefined) ?? fallbackGender;
  if (!gender) return false;

  const age = Math.max(0, toNumber(pick(c, ['age'])) ?? 0);
  const heightCm = Math.max(0, toNumber(pick(c, ['height'])) ?? 0);
  const weightKg = Math.max(0, toNumber(pick(c, ['weight'])) ?? 0);
  const sleepHoursWhole = Math.max(0, toNumber(pick(c, ['sleepHours'])) ?? 0);
  const sleepMinutes = Math.max(0, toNumber(pick(c, ['sleepMinutes'])) ?? 0);
  const sleepHours = Math.min(24, sleepHoursWhole + sleepMinutes / 60);

  store.resetInspectionDraft(gender);

  if (age > 0 && heightCm > 0 && weightKg > 0) {
    store.applyInspectionStep1({ age, heightCm, weightKg });
  }

  if (gender === 'female') {
    store.applyInspectionStep2({
      menarcheAge: Math.max(0, toNumber(pick(c, ['menarcheAge'])) ?? 0),
      parity: Math.max(0, toNumber(pick(c, ['parity'])) ?? 0),
      femaleConditions: restoreFemaleConditions(c),
    });

    const bingeDaysPerYear = Math.max(
      0,
      toNumber(pick(c, ['bingeDaysPerYear', 'binge12'])) ?? 0,
    );
    const smokeLevel = femaleSmokeCount(
      toNumber(pick(c, ['cigarettesPerDay', 'smokeLevel'])),
    );
    const drinkStatus = femaleDrinkStatusFromAny(
      pick(c, ['drinkStatus']),
      pick(c, ['drinkLevel']),
      pick(c, ['drinkLabel']),
      bingeDaysPerYear,
    );

    store.applyInspectionStep3({
      smokeLevel,
      drinkStatus,
      binge12: bingeDaysPerYear,
      sleepHours,
    });
  } else {
    const hasSex12Mo = toBool(pick(c, ['hasSex12Mo']));
    if (hasSex12Mo !== null) {
      store.applyInspectionMaleStep2({
        numBioKid: Math.max(0, toNumber(pick(c, ['numBioKid'])) ?? 0),
        sexFreq: Math.max(0, toNumber(pick(c, ['sexFreq'])) ?? 0),
        hasSex12Mo,
      });
    }

    const smokeStatus =
      fromApiSmokeStatus(typeof pick(c, ['smokeStatus', 'smokeLabel']) === 'string'
        ? String(pick(c, ['smokeStatus', 'smokeLabel']))
        : null) ?? 'none';
    const drinkStatus =
      fromApiDrinkStatus(typeof pick(c, ['drinkStatus', 'drinkLabel']) === 'string'
        ? String(pick(c, ['drinkStatus', 'drinkLabel']))
        : null) ?? 'none';

    store.applyInspectionMaleStep3({
      maleConditions: restoreMaleConditions(c),
      smokeStatus: smokeStatus as SmokeStatus,
      drinkStatus,
    });

    const bingeStatus =
      fromApiBingeStatus(typeof pick(c, ['bingeStatus', 'bingeLabel']) === 'string'
        ? String(pick(c, ['bingeStatus', 'bingeLabel']))
        : null) ?? 'none';

    store.applyInspectionMaleStep4({
      bingeStatus: bingeStatus as BingeStatus,
      sleepHours,
      sleepQuality: toNumber(pick(c, ['sleepQuality'])),
    });
  }

  const pssAnswers = restorePssAnswers(c);
  const hasPss = pssAnswers.some((value) => value !== null);
  if (hasPss) {
    const pssSum = pssAnswers.reduce<number>((acc, value) => acc + (value ?? 0), 0);
    useSimulatorStore.setState({ pssAnswers, pssSum });
  }

  return true;
}
