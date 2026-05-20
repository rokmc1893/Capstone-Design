import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getCommunityHintCopy,
  useCommunityGuideStore,
} from '../../store/useCommunityGuideStore';
import type { CommunityHintKey } from '../../types/community';

type CommunityCoachMarkProps = {
  hintKey: CommunityHintKey | null;
  onClose: () => void;
  onComplete?: () => void;
};

export function CommunityCoachMark({
  hintKey,
  onClose,
  onComplete,
}: CommunityCoachMarkProps) {
  const dismissForSession = useCommunityGuideStore((s) => s.dismissForSession);
  const dismissPermanently = useCommunityGuideStore((s) => s.dismissPermanently);
  const acknowledgeHint = useCommunityGuideStore((s) => s.acknowledgeHint);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hintKey) {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [hintKey]);

  const copy = hintKey ? getCommunityHintCopy(hintKey) : null;

  const finish = (mode: 'skip' | 'never' | 'next') => {
    if (!hintKey) return;
    if (mode === 'never') dismissPermanently(hintKey);
    else if (mode === 'skip') dismissForSession(hintKey);
    else acknowledgeHint(hintKey);
    setVisible(false);
    onComplete?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {visible && copy ? (
        <motion.div
          className="fixed inset-0 z-[75] flex items-end justify-center px-6 pb-[max(120px,env(safe-area-inset-bottom,0px)+100px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#2a2440]/35 backdrop-blur-[3px]"
            aria-label="가이드 닫기"
            onClick={() => finish('skip')}
          />
          <motion.div
            role="dialog"
            aria-labelledby="coach-mark-title"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-[340px] rounded-[24px] border border-white/28 bg-white/[0.14] px-5 py-5 shadow-[0_20px_56px_rgba(15,23,42,0.28)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55">
              안내
            </p>
            <h3
              id="coach-mark-title"
              className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-white/96"
            >
              {copy.title}
            </h3>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.65] text-white/78">
              {copy.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => finish('skip')}
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition active:bg-white/10"
              >
                건너뛰기
              </button>
              <button
                type="button"
                onClick={() => finish('never')}
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition active:bg-white/10"
              >
                다시 보지 않기
              </button>
              <button
                type="button"
                onClick={() => finish('next')}
                className="ml-auto rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#7B6EE8] shadow-sm transition active:scale-[0.98]"
              >
                다음
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
