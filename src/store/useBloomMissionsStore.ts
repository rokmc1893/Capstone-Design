import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MissionId = 'quit-smoking' | 'exercise-30' | 'sleep-7h';

export type BloomStage = 1 | 2 | 3 | 4 | 5;

interface BloomMissionsState {
  level: BloomStage;
  xp: number;
  completed: Record<MissionId, boolean>;
  blooms: number;
  toggleMission: (id: MissionId) => void;
}

const XP_PER_MISSION = 5;
const XP_PER_LEVEL = 100;
const MAX_LEVEL: BloomStage = 5;

export const useBloomMissionsStore = create<BloomMissionsState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      completed: {
        'quit-smoking': false,
        'exercise-30': false,
        'sleep-7h': false,
      },
      blooms: 0,
      toggleMission: (id) => {
        const prev = get();
        const wasDone = prev.completed[id];
        let xp = prev.xp + (wasDone ? -XP_PER_MISSION : XP_PER_MISSION);
        if (xp < 0) xp = 0;

        let level = prev.level;
        let blooms = prev.blooms;

        while (xp >= XP_PER_LEVEL) {
          xp -= XP_PER_LEVEL;
          if (level < MAX_LEVEL) {
            level = (level + 1) as BloomStage;
          } else {
            blooms += 1;
            level = 1;
          }
        }

        return set({
          xp,
          level,
          blooms,
          completed: {
            ...prev.completed,
            [id]: !wasDone,
          },
        });
      },
    }),
    {
      name: 'bloom-missions',
    },
  ),
);

