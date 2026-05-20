import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';
import { communitySpringTap } from '../../../lib/community/interactionMotion';

type BookmarkButtonProps = {
  active: boolean;
  onToggle: (anchor: HTMLElement) => void;
};

export const BookmarkButton = memo(function BookmarkButton({
  active,
  onToggle,
}: BookmarkButtonProps) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!active) {
      setJustSaved(false);
      return;
    }
    setJustSaved(true);
    const t = window.setTimeout(() => setJustSaved(false), 520);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <motion.button
      type="button"
      data-community-hint="bookmark"
      onClick={(e) => {
        e.stopPropagation();
        communityHapticLight();
        onToggle(e.currentTarget);
      }}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${
        active
          ? 'bg-white/28 text-[#FF3AA7] shadow-[0_0_22px_rgba(255,58,167,0.28)]'
          : 'bg-white/10 text-white/72 hover:bg-white/14'
      }`}
      aria-pressed={active}
      aria-label={active ? '저장 해제' : '저장'}
      whileTap={{ scale: 0.88 }}
      transition={communitySpringTap}
    >
      <AnimatePresence>
        {justSaved ? (
          <motion.span
            key="pulse"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#FF3AA7]/25"
            initial={{ scale: 0.65, opacity: 0.55 }}
            animate={{ scale: 1.75, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.2, 0.8, 0.2, 1] }}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
        <Bookmark className="h-4 w-4 text-current" fill="none" strokeWidth={1.75} />
        <motion.span
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          initial={false}
          animate={{ scaleY: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{
            scaleY: { duration: 0.34, ease: [0.2, 0.8, 0.2, 1] },
            opacity: { duration: 0.22 },
          }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <Bookmark className="h-4 w-4 text-[#FF3AA7]" fill="currentColor" strokeWidth={1.75} />
        </motion.span>
      </span>

    </motion.button>
  );
});
