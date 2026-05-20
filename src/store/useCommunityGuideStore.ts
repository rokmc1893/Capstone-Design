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
    body: '다른 사용자와\n경험을 나눠 보세요',
  },
  report: {
    title: '신고',
    body: '커뮤니티를 건강하게\n유지하기 위한 기능이에요',
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
  permanentlyDismissed: CommunityHintKey[];
  sessionDismissed: CommunityHintKey[];
  shouldShowHint: (key: CommunityHintKey) => boolean;
  dismissForSession: (key: CommunityHintKey) => void;
  dismissPermanently: (key: CommunityHintKey) => void;
  acknowledgeHint: (key: CommunityHintKey) => void;
};

export const useCommunityGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      permanentlyDismissed: [],
      sessionDismissed: [],

      shouldShowHint: (key) => {
        const { permanentlyDismissed, sessionDismissed } = get();
        return (
          !permanentlyDismissed.includes(key) && !sessionDismissed.includes(key)
        );
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
          permanentlyDismissed: s.permanentlyDismissed.includes(key)
            ? s.permanentlyDismissed
            : [...s.permanentlyDismissed, key],
          sessionDismissed: [...s.sessionDismissed, key],
        }));
      },

      acknowledgeHint: (key) => {
        get().dismissPermanently(key);
      },
    }),
    {
      name: 'community-guide-v1',
      partialize: (s) => ({ permanentlyDismissed: s.permanentlyDismissed }),
      merge: (persisted, current) => ({
        ...current,
        permanentlyDismissed: Array.isArray(
          (persisted as { permanentlyDismissed?: CommunityHintKey[] })
            ?.permanentlyDismissed,
        )
          ? (persisted as { permanentlyDismissed: CommunityHintKey[] })
              .permanentlyDismissed
          : current.permanentlyDismissed,
        sessionDismissed: [],
      }),
    },
  ),
);
