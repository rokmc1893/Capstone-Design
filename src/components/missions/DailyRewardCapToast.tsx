import { AnimatePresence, motion } from 'framer-motion';
import { DAILY_REWARD_CAP_MESSAGE } from '../../store/useBloomMissionsStore';
import { typeCaptionXs } from '../../lib/typography';

type DailyRewardCapToastProps = {
  show: boolean;
};

/** 일일 경험치 상한 안내 — 상단에 잠깐 표시 후 서서히 사라짐 */
export function DailyRewardCapToast({ show }: DailyRewardCapToastProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="daily-reward-cap-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
          }}
          exit={{
            opacity: 0,
            y: -8,
            transition: { duration: 1.1, ease: 'easeInOut' },
          }}
          className="rounded-[12px] bg-black/30 px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.22)] ring-1 ring-white/20 backdrop-blur-md"
        >
          <p className={`${typeCaptionXs} text-white/92`}>{DAILY_REWARD_CAP_MESSAGE}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
