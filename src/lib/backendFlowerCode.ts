import type { FlowerId } from '../data/missionFlowers';

/** 백엔드 꽃 종 코드 → 프론트 `FlowerId` (서버는 PEONY / BABYS_BREATH / LOTUS 3종) */
const BACKEND_TO_FLOWER_ID: Record<string, FlowerId> = {
  PEONY: 'peony',
  BABYS_BREATH: 'babys-breath',
  LOTUS: 'lotus',
};

export function flowerIdFromBackendCode(code: unknown): FlowerId | null {
  if (typeof code !== 'string' || !code.trim()) return null;
  const key = code.trim().toUpperCase();
  return BACKEND_TO_FLOWER_ID[key] ?? null;
}
