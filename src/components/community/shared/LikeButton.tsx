import { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';

type LikeButtonProps = {
  count: number;
  active: boolean;
  onToggle: () => void;
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
      onClick={(e) => {
        e.stopPropagation();
        communityHapticLight();
        onToggle();
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
        active ? 'text-[#FF3AA7]' : 'text-white/70'
      }`}
      aria-pressed={active}
      aria-label={active ? `${label} 취소, ${count}개` : `${label} ${count}개`}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 520, damping: 28 }}
    >
      <motion.span
        key={active ? 'on' : 'off'}
        initial={{ scale: 0.75 }}
        animate={{ scale: active ? [1, 1.18, 1] : 1 }}
        transition={{
          type: 'spring',
          stiffness: active ? 560 : 420,
          damping: active ? 18 : 28,
        }}
      >
        <Heart className={icon} fill={active ? 'currentColor' : 'none'} strokeWidth={1.75} />
      </motion.span>
      <span className="text-[12px] font-semibold tabular-nums">{count}</span>
    </motion.button>
  );
});
