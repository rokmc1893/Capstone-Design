import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlowerId } from '../data/missionFlowers';

export type BloomRecordEntry = {
  flowerId: FlowerId;
  /** 개화 완료 시각 (ISO) */
  completedAt: string;
};

export type BloomStage = 1 | 2 | 3 | 4 | 5;

interface BloomMissionsState {
  level: BloomStage;
  xp: number;
  /** 미션 id → 완료 여부 (동적 id 포함) */
  completed: Record<string, boolean>;
  blooms: number;
  bloomRecords: BloomRecordEntry[];
  selectedFlowerId: FlowerId;
  setSelectedFlower: (id: FlowerId) => void;
  toggleMission: (id: string) => void;
}

const XP_PER_MISSION = 5;
const XP_PER_LEVEL = 100;
const MAX_LEVEL: BloomStage = 5;

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
      completed: {},
      blooms: 0,
      bloomRecords: [],
      selectedFlowerId: 'lily',
      setSelectedFlower: (id) => set({ selectedFlowerId: id }),
      toggleMission: (id) => {
        const prev = get();
        const wasDone = prev.completed[id];
        let xp = prev.xp + (wasDone ? -XP_PER_MISSION : XP_PER_MISSION);
        if (xp < 0) xp = 0;

        let level = prev.level;
        let blooms = prev.blooms;
        const bloomRecords = [...prev.bloomRecords];
        const flowerId = prev.selectedFlowerId;

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

        return set({
          xp,
          level,
          blooms,
          bloomRecords,
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
          Omit<BloomMissionsState, 'toggleMission' | 'setSelectedFlower'>
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
        return {
          ...currentState,
          ...p,
          completed: mergedCompleted,
          bloomRecords: records,
          selectedFlowerId: fid,
        };
      },
    },
  ),
);
