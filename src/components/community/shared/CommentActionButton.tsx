import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

type CommentActionButtonProps = {
  count: number;
  active?: boolean;
  onClick: () => void;
};

export const CommentActionButton = memo(function CommentActionButton({
  count,
  active = false,
  onClick,
}: CommentActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
        active ? 'bg-white/15 text-white ring-1 ring-white/25' : 'text-white/70'
      }`}
      aria-expanded={active}
      aria-label={`댓글 ${count}개, 댓글 작성`}
      whileTap={{ scale: 0.92 }}
      animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      <span className="text-[12px] font-semibold tabular-nums">{count}</span>
    </motion.button>
  );
});
