import { useSimulatorStore } from '../store/useSimulatorStore';
import { useTestSessionStore } from '../store/useTestSessionStore';
import { patchTestSessionFemaleStep, patchTestSessionMaleStep } from './testsSessionApi';
import {
  femaleConditionFlags,
  maleConditionFlags,
  splitSleepHours,
  toApiBingeStatus,
  toApiDrinkStatus,
  toApiSmokeStatus,
} from './testsSessionMappers';

function activeSessionId(): string | null {
  if (!import.meta.env.VITE_API_BASE_URL) return null;
  return useTestSessionStore.getState().sessionId;
}

/** 남성 설문 UI step 1~4 → 백엔드 `PATCH .../step/male` (step, height, weight 등) */
export async function syncMaleInspectionStep(uiStep: 1 | 2 | 3 | 4): Promise<void> {
  const sessionId = activeSessionId();
  if (!sessionId) return;
  const s = useSimulatorStore.getState();

  let body: Record<string, unknown>;

  switch (uiStep) {
    case 1:
      body = {
        step: 1,
        age: s.age,
        height: s.heightCm,
        weight: s.weightKg,
      };
      break;
    case 2:
      if (s.hasSex12Mo === null) return;
      body = {
        step: 2,
        numBioKid: s.numBioKid,
        sexFreq: s.sexFreq,
        hasSex12Mo: s.hasSex12Mo,
      };
      break;
    case 3:
      if (s.smokeStatus == null || s.drinkStatus == null) return;
      body = {
        step: 3,
        ...maleConditionFlags(s.maleConditions),
        smokeStatus: toApiSmokeStatus(s.smokeStatus),
        drinkStatus: toApiDrinkStatus(s.drinkStatus),
      };
      break;
    case 4:
      if (s.bingeStatus == null) return;
      body = {
        step: 4,
        bingeStatus: toApiBingeStatus(s.bingeStatus),
        ...splitSleepHours(s.sleepHours),
      };
      break;
    default:
      return;
  }

  await patchTestSessionMaleStep(sessionId, body).catch(() => {});
}

/** 여성 설문 UI step 1~3 → 백엔드 `PATCH .../step/female` */
export async function syncFemaleInspectionStep(uiStep: 1 | 2 | 3): Promise<void> {
  const sessionId = activeSessionId();
  if (!sessionId) return;
  const s = useSimulatorStore.getState();

  let body: Record<string, unknown>;

  switch (uiStep) {
    case 1:
      body = {
        step: 1,
        age: s.age,
        height: s.heightCm,
        weight: s.weightKg,
      };
      break;
    case 2:
      body = {
        step: 2,
        menarcheAge: s.menarcheAge,
        parity: s.parity,
        ...femaleConditionFlags(s.femaleConditions),
      };
      break;
    case 3:
      body = {
        step: 3,
        smokeLevel: s.smokeLevel,
        binge12: s.binge12 > 0 ? 1 : 0,
        ...splitSleepHours(s.sleepHours),
      };
      break;
    default:
      return;
  }

  await patchTestSessionFemaleStep(sessionId, body).catch(() => {});
}

/** PSS 구간 진행 표시 — 백엔드 `step` 4~6 (데이터는 submit 시 `pssAnswers`) */
export async function syncFemaleInspectionProgressStep(step: 4 | 5 | 6): Promise<void> {
  const sessionId = activeSessionId();
  if (!sessionId) return;
  await patchTestSessionFemaleStep(sessionId, { step }).catch(() => {});
}
