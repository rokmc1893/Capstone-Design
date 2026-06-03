import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';
import { communityEaseSoft, communitySpringPop, communitySpringTap } from '../../../lib/community/interactionMotion';

type LikeButtonProps = {
  count: number;
  active: boolean;
  onToggle: (anchor: HTMLElement) => void;
  label?: string;
  size?: 'sm' | 'md';
};

export const LikeButton = memo(function LikeButton({
  count,
  active,
  onToggle,
  label = '좋아요',
  size = 'md',
}: LikeButtonProps) {
  const icon = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <motion.button
      type="button"
      data-community-hint="like"
      onClick={(e) => {
        e.stopPropagation();
        communityHapticLight();
        onToggle(e.currentTarget);
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors duration-200 ${
        active ? 'text-[#FF3AA7]' : 'text-white/70'
      }`}
      aria-pressed={active}
      aria-label={active ? `${label} 취소, ${count}개` : `${label} ${count}개`}
      whileTap={{ scale: 0.9 }}
      transition={communitySpringTap}
    >
      <span className="relative flex items-center justify-center">
        <motion.span
          key={active ? 'liked' : 'idle'}
          initial={{ scale: 0.82, opacity: 0.7 }}
          animate={{
            scale: active ? [1, 1.2, 1] : 1,
            opacity: 1,
          }}
          transition={
            active
              ? { scale: { duration: 0.38, ease: communityEaseSoft }, opacity: { duration: 0.2 } }
              : communitySpringPop
          }
        >
          <Heart className={icon} fill={active ? 'currentColor' : 'none'} strokeWidth={1.75} />
        </motion.span>
        <AnimatePresence>
          {active ? (
            <motion.span
              key="glow"
              className="pointer-events-none absolute -inset-1 rounded-full bg-[#FF3AA7]/20"
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: communityEaseSoft }}
              aria-hidden
            />
          ) : null}
        </AnimatePresence>
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.22, ease: communityEaseSoft }}
          className="text-[12px] font-semibold tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
});
