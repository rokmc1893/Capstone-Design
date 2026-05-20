import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { communityEaseSoft } from '../../lib/community/interactionMotion';

export type CommunityToastTone = 'default' | 'saved' | 'success';

type CommunityToastProps = {
  message: string | null;
  tone?: CommunityToastTone;
};

/** 커뮤니티 — 부드러운 상단 토스트 (Toss 스타일 피드백) */
export function CommunityToast({ message, tone = 'default' }: CommunityToastProps) {
  const Icon =
    tone === 'saved' ? Bookmark : tone === 'success' ? CheckCircle2 : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(52px,env(safe-area-inset-top,0px)+44px)] z-[80] flex justify-center px-6">
      <AnimatePresence>
        {message ? (
          <motion.div
            key={message}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -10, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.34, ease: communityEaseSoft },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.97,
              transition: { duration: 0.26, ease: 'easeInOut' },
            }}
            className="flex max-w-[min(320px,100%)] items-center gap-2.5 rounded-[16px] border border-white/28 bg-white/[0.16] px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.24)] backdrop-blur-xl"
          >
            {Icon ? (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className={
                  tone === 'saved'
                    ? 'text-[#FF3AA7]'
                    : 'text-emerald-200/95'
                }
                aria-hidden
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} fill={tone === 'saved' ? 'currentColor' : 'none'} />
              </motion.span>
            ) : null}
            <p className="text-[14px] font-medium leading-snug tracking-[-0.02em] text-white/95">
              {message}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
