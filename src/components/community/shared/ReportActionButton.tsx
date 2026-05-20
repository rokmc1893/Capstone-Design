import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flag } from 'lucide-react';
import { communityHapticLight } from '../../../lib/community/haptics';
import { communitySpringTap } from '../../../lib/community/interactionMotion';

type ReportActionButtonProps = {
  onClick: (anchor: HTMLElement) => void;
};

export const ReportActionButton = memo(function ReportActionButton({ onClick }: ReportActionButtonProps) {
  return (
    <motion.button
      type="button"
      data-community-hint="report"
      onClick={(e) => {
        communityHapticLight();
        onClick(e.currentTarget);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/[0.10] px-3.5 py-2 text-[12px] font-semibold text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-colors hover:bg-white/[0.14]"
      whileTap={{ scale: 0.94 }}
      transition={communitySpringTap}
    >
      <Flag className="h-3.5 w-3.5 text-white/55" strokeWidth={1.75} aria-hidden />
      신고
    </motion.button>
  );
});
