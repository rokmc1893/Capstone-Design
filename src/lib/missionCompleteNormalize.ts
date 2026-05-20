import type { MissionCompleteResponseDto } from '../types/backendApi';

/** POST `/api/missions/{id}/complete` — `result` 래핑·필드명 차이 흡수 */
export function normalizeMissionCompleteResponse(raw: unknown): MissionCompleteResponseDto {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  const inner = o.result;
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return normalizeMissionCompleteResponse(inner);
  }

  const pickNum = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? v : undefined;

  const pickBool = (v: unknown): boolean | undefined =>
    typeof v === 'boolean' ? v : undefined;

  const flower =
    o.newFlower ??
    o.currentFlower ??
    o.currentFlowerType ??
    o.flowerType ??
    o.activeFlower;

  return {
    missionId: pickNum(o.missionId),
    expGained: pickNum(o.expGained ?? o.expGain),
    currentExp: pickNum(o.currentExp ?? o.exp),
    currentLevel: pickNum(o.currentLevel ?? o.level),
    requiredExpForCurrentLevel: pickNum(
      o.requiredExpForCurrentLevel ?? o.requiredExp ?? o.requiredExpForNext,
    ),
    isLevelUp: pickBool(o.isLevelUp ?? o.levelUp),
    alreadyCompleted: pickBool(o.alreadyCompleted),
    dailyRewardCapReached: pickBool(o.dailyRewardCapReached),
    newFlower: typeof flower === 'string' || flower === null ? (flower as string | null) : undefined,
  };
}
