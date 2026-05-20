import { AnimatePresence, motion } from 'framer-motion';

type CommunityToastProps = {
  message: string | null;
};

/** 커뮤니티 — 부드러운 상단 토스트 */
export function CommunityToast({ message }: CommunityToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(52px,env(safe-area-inset-top,0px)+44px)] z-[80] flex justify-center px-6">
      <AnimatePresence>
        {message ? (
          <motion.div
            key={message}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] },
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
              transition: { duration: 0.28, ease: 'easeInOut' },
            }}
            className="max-w-[320px] rounded-[16px] border border-white/25 bg-white/[0.14] px-4 py-3 shadow-[0_12px_36px_rgba(15,23,42,0.22)] backdrop-blur-xl"
          >
            <p className="text-center text-[14px] font-medium leading-snug tracking-[-0.02em] text-white/95">
              {message}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
