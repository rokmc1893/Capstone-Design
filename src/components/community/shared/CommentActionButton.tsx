import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';
import { communityEaseSoft, communitySpringTap } from '../../../lib/community/interactionMotion';

type CommentActionButtonProps = {
  count: number;
  active?: boolean;
  onClick: (anchor: HTMLElement) => void;
};

export const CommentActionButton = memo(function CommentActionButton({
  count,
  active = false,
  onClick,
}: CommentActionButtonProps) {
  return (
    <motion.button
      type="button"
      data-community-hint="comment"
      onClick={(e) => {
        e.stopPropagation();
        communityHapticLight();
        onClick(e.currentTarget);
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors duration-300 ${
        active
          ? 'bg-white/18 text-white ring-1 ring-white/30 shadow-[0_0_16px_rgba(255,255,255,0.12)]'
          : 'text-white/70'
      }`}
      aria-expanded={active}
      aria-label={`댓글 ${count}개, 댓글 작성`}
      whileTap={{ scale: 0.9 }}
      animate={
        active
          ? {
              scale: [1, 1.05, 1],
              transition: { duration: 0.36, ease: communityEaseSoft },
            }
          : { scale: 1 }
      }
      transition={communitySpringTap}
    >
      <motion.span
        animate={active ? { rotate: [0, -8, 0] } : { rotate: 0 }}
        transition={{ duration: 0.4, ease: communityEaseSoft }}
        aria-hidden
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
      </motion.span>
      <span className="text-[12px] font-semibold tabular-nums">{count}</span>
    </motion.button>
  );
});
