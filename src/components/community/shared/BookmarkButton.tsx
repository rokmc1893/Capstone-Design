import { memo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';

type BookmarkButtonProps = {
  active: boolean;
  onToggle: () => void;
  /** coach mark 앵커용 */
  id?: string;
};

export const BookmarkButton = memo(function BookmarkButton({
  active,
  onToggle,
  id,
}: BookmarkButtonProps) {
  return (
    <motion.button
      id={id}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        communityHapticLight();
        onToggle();
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-white/28 text-[#FF3AA7] shadow-[0_0_20px_rgba(255,58,167,0.25)]'
          : 'bg-white/10 text-white/75'
      }`}
      aria-pressed={active}
      aria-label={active ? '저장 해제' : '저장'}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
    >
      <motion.span
        key={active ? 'saved' : 'idle'}
        initial={{ scale: 0.72, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 480, damping: 22 }}
      >
        <Bookmark
          className="h-4 w-4"
          fill={active ? 'currentColor' : 'none'}
          strokeWidth={1.75}
        />
      </motion.span>
    </motion.button>
  );
});
