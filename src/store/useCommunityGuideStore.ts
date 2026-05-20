import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommunityHintKey } from '../types/community';

const HINT_COPY: Record<
  CommunityHintKey,
  { title: string; body: string }
> = {
  bookmark: {
    title: '저장한 글',
    body: '저장한 글은 나중에\n다시 확인할 수 있어요',
  },
  comment: {
    title: '댓글',
    body: '다른 사용자와\n경험을 공유해 보세요',
  },
  report: {
    title: '신고',
    body: '건강한 커뮤니티를\n위한 기능이에요',
  },
  like: {
    title: '좋아요',
    body: '마음에 드는 글에\n조용히 공감해 보세요',
  },
};

export function getCommunityHintCopy(key: CommunityHintKey) {
  return HINT_COPY[key];
}

type GuideState = {
  /** localStorage — 다시 보지 않기 · 다음(완료) */
  dismissedHints: CommunityHintKey[];
  /** 세션 — 건너뛰기 */
  sessionDismissed: CommunityHintKey[];
  shouldShowHint: (key: CommunityHintKey) => boolean;
  dismissForSession: (key: CommunityHintKey) => void;
  dismissPermanently: (key: CommunityHintKey) => void;
  /** 다음 — 안내 확인 후 해당 기능 계속 */
  completeHint: (key: CommunityHintKey) => void;
};

export const useCommunityGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      dismissedHints: [],
      sessionDismissed: [],

      shouldShowHint: (key) => {
        const { dismissedHints, sessionDismissed } = get();
        return !dismissedHints.includes(key) && !sessionDismissed.includes(key);
      },

      dismissForSession: (key) => {
        set((s) => ({
          sessionDismissed: s.sessionDismissed.includes(key)
            ? s.sessionDismissed
            : [...s.sessionDismissed, key],
        }));
      },

      dismissPermanently: (key) => {
        set((s) => ({
          dismissedHints: s.dismissedHints.includes(key)
            ? s.dismissedHints
            : [...s.dismissedHints, key],
          sessionDismissed: [...s.sessionDismissed, key],
        }));
      },

      completeHint: (key) => {
        set((s) => ({
          dismissedHints: s.dismissedHints.includes(key)
            ? s.dismissedHints
            : [...s.dismissedHints, key],
        }));
      },
    }),
    {
      name: 'community-guide-v2',
      partialize: (s) => ({ dismissedHints: s.dismissedHints }),
      merge: (persisted, current) => {
        const saved = persisted as { dismissedHints?: CommunityHintKey[] } | undefined;
        const legacy = persisted as { permanentlyDismissed?: CommunityHintKey[] } | undefined;
        const merged = Array.isArray(saved?.dismissedHints)
          ? saved.dismissedHints
          : Array.isArray(legacy?.permanentlyDismissed)
            ? legacy.permanentlyDismissed
            : current.dismissedHints;
        return {
          ...current,
          dismissedHints: merged,
          sessionDismissed: [],
        };
      },
    },
  ),
);
