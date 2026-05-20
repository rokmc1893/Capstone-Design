import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { flowerIdFromBackendCode } from '../lib/backendFlowerCode';
import { pickRandomMissionFlowerId, type FlowerId } from '../data/missionFlowers';
import type { MissionCompleteResponseDto } from '../types/backendApi';

export type BloomRecordEntry = {
  flowerId: FlowerId;
  /** 개화 완료 시각 (ISO) */
  completedAt: string;
};

export type BloomStage = 1 | 2 | 3 | 4 | 5;

interface BloomMissionsState {
  level: BloomStage;
  xp: number;
  /** 미션 완료 시 서버가 주는 다음 레벨까지 필요 EXP (없으면 100으로 표시) */
  requiredExpForNext: number | null;
  /** 미션 id → 완료 여부 (동적 id 포함) */
  completed: Record<string, boolean>;
  blooms: number;
  bloomRecords: BloomRecordEntry[];
  selectedFlowerId: FlowerId;
  setSelectedFlower: (id: FlowerId) => void;
  toggleMission: (id: string) => void;
  /** 웰니스 미션 완료 API 응답으로 새싹·경험치 동기화 */
  applyMissionCompleteDto: (dto: MissionCompleteResponseDto) => void;
  /** API 미션 행만 완료 체크 (경험치는 applyMissionCompleteDto에서 반영) */
  markMissionCompleted: (id: string) => void;
  /** `GET /home`의 `user.level` / `user.exp` / 꽃 종류 반영 */
  applyHomeSprout: (payload: { level?: number; exp?: number; flowerType?: string | null }) => void;
  /** 로컬 날짜(YYYY-MM-DD) 기준 오늘 일일 경험치 상한 도달일 (자정 이후 무효) */
  dailyRewardCapDate: string | null;
  /** API·미션 완료 응답으로 일일 경험치 상한 상태 동기화 */
  syncDailyRewardCapReached: (reached?: boolean) => void;
}

const XP_PER_MISSION = 5;
const XP_PER_LEVEL = 100;
const MAX_LEVEL: BloomStage = 5;

export const DAILY_REWARD_CAP_MESSAGE = '오늘 받을 수 있는 경험치 상한에 도달했어요.';

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isDailyRewardCapActive(capDate: string | null): boolean {
  return capDate === localDateKey();
}

function clampSproutLevel(n: number): BloomStage {
  if (!Number.isFinite(n)) return 1;
  if (n < 1) return 1;
  if (n > 5) return 5;
  return Math.round(n) as BloomStage;
}

function parseFlowerIdFromNewFlower(raw: unknown): FlowerId | null {
  if (typeof raw === 'string') return flowerIdFromBackendCode(raw);
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = (o.flowerId ?? o.flowerCode ?? o.flowerType ?? o.code) as string | undefined;
  if (!id) return null;
  return flowerIdFromBackendCode(id);
}

function normalizeBloomRecords(raw: unknown): BloomRecordEntry[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const first = raw[0] as unknown;
  if (typeof first === 'string') {
    return (raw as string[]).map((flowerId) => ({
      flowerId: flowerId as FlowerId,
      completedAt: new Date().toISOString(),
    }));
  }
  return raw as BloomRecordEntry[];
}

export const useBloomMissionsStore = create<BloomMissionsState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      requiredExpForNext: null,
      completed: {},
      blooms: 0,
      bloomRecords: [],
      selectedFlowerId: 'lily',
      dailyRewardCapDate: null,
      setSelectedFlower: (id) => set({ selectedFlowerId: id }),
      syncDailyRewardCapReached: (reached) => {
        if (reached === true) set({ dailyRewardCapDate: localDateKey() });
        else if (reached === false) set({ dailyRewardCapDate: null });
      },
      applyMissionCompleteDto: (dto) => {
        set((prev) => {
          const next: Partial<BloomMissionsState> = {};
          if (dto.dailyRewardCapReached) next.dailyRewardCapDate = localDateKey();

          const activeFlower = parseFlowerIdFromNewFlower(
            dto.currentFlowerType ?? dto.flowerType,
          );
          if (activeFlower) next.selectedFlowerId = activeFlower;

          if (dto.currentLevel != null) next.level = clampSproutLevel(dto.currentLevel);
          if (dto.currentExp != null) next.xp = Math.max(0, Math.round(dto.currentExp));
          if (dto.requiredExpForCurrentLevel != null) {
            next.requiredExpForNext = Math.max(1, Math.round(dto.requiredExpForCurrentLevel));
          }

          const bloomFlower = parseFlowerIdFromNewFlower(dto.newFlower);
          if (!bloomFlower) {
            return { ...prev, ...next };
          }

          const bloomRecords = [
            ...prev.bloomRecords,
            { flowerId: bloomFlower, completedAt: new Date().toISOString() },
          ];
          return {
            ...prev,
            ...next,
            selectedFlowerId: bloomFlower,
            bloomRecords,
            blooms: prev.blooms + 1,
            level: dto.currentLevel != null ? clampSproutLevel(dto.currentLevel) : 1,
            xp: dto.currentExp != null ? Math.max(0, Math.round(dto.currentExp)) : 0,
          };
        });
      },
      markMissionCompleted: (id) =>
        set((s) => ({
          completed: { ...s.completed, [id]: true },
        })),
      applyHomeSprout: ({ level, exp, flowerType }) =>
        set((s) => {
          const fid = flowerType != null ? parseFlowerIdFromNewFlower(flowerType) : null;
          return {
            level: level != null ? clampSproutLevel(level) : s.level,
            xp: exp != null ? Math.max(0, Math.round(exp)) : s.xp,
            ...(fid ? { selectedFlowerId: fid } : {}),
          };
        }),
      toggleMission: (id) => {
        const prev = get();
        const wasDone = prev.completed[id];
        let xp = prev.xp + (wasDone ? -XP_PER_MISSION : XP_PER_MISSION);
        if (xp < 0) xp = 0;

        let level = prev.level;
        let blooms = prev.blooms;
        const bloomRecords = [...prev.bloomRecords];
        const flowerId = prev.selectedFlowerId;
        const bloomsBefore = blooms;

        while (xp >= XP_PER_LEVEL) {
          xp -= XP_PER_LEVEL;
          if (level < MAX_LEVEL) {
            level = (level + 1) as BloomStage;
          } else {
            blooms += 1;
            bloomRecords.push({ flowerId, completedAt: new Date().toISOString() });
            level = 1;
          }
        }

        const selectedFlowerId =
          blooms > bloomsBefore ? pickRandomMissionFlowerId() : prev.selectedFlowerId;

        return set({
          xp,
          level,
          blooms,
          bloomRecords,
          selectedFlowerId,
          completed: {
            ...prev.completed,
            [id]: !wasDone,
          },
        });
      },
    }),
    {
      name: 'bloom-missions',
      merge: (persistedState, currentState) => {
        const p = persistedState as Partial<
          Omit<
            BloomMissionsState,
            | 'toggleMission'
            | 'setSelectedFlower'
            | 'applyMissionCompleteDto'
            | 'markMissionCompleted'
            | 'applyHomeSprout'
          >
        > | null;
        if (!p || typeof p !== 'object') return currentState;
        const blooms = typeof p.blooms === 'number' ? p.blooms : currentState.blooms;
        const fid = p.selectedFlowerId ?? currentState.selectedFlowerId;
        let records = normalizeBloomRecords(p.bloomRecords);
        if (records.length < blooms) {
          records = [
            ...records,
            ...Array(blooms - records.length)
              .fill(0)
              .map(() => ({ flowerId: fid, completedAt: new Date().toISOString() })),
          ];
        }
        const mergedCompleted = { ...currentState.completed, ...(p.completed ?? {}) };
        const requiredExpForNext =
          typeof p.requiredExpForNext === 'number' ? p.requiredExpForNext : currentState.requiredExpForNext;
        const capDate = typeof p.dailyRewardCapDate === 'string' ? p.dailyRewardCapDate : null;
        const dailyRewardCapDate = isDailyRewardCapActive(capDate) ? capDate : null;
        return {
          ...currentState,
          ...p,
          requiredExpForNext,
          dailyRewardCapDate,
          completed: mergedCompleted,
          bloomRecords: records,
          selectedFlowerId: fid,
        };
      },
    },
  ),
);
