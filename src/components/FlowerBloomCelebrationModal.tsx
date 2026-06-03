import { AnimatePresence, motion } from 'framer-motion';
import type { MissionFlower } from '../data/missionFlowers';
import { getMissionFlowerStageImageSrc } from '../data/missionFlowers';
import { MissionFlowerStageImage } from './missions/MissionFlowerStageImage';
import { springPremium } from '../lib/motionPresets';

type FlowerBloomCelebrationModalProps = {
  flower: MissionFlower;
  open: boolean;
  onClose: () => void;
};

export function FlowerBloomCelebrationModal({ flower, open, onClose }: FlowerBloomCelebrationModalProps) {
  const [m1, m2] = flower.flowerMeaningsPopup;
  const displayName = `${flower.nameKo} (${flower.nameEn})`;
  const bloomImageSrc = getMissionFlowerStageImageSrc(flower, 5);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="flower-bloom-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            aria-label="닫기"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative z-[1] w-full max-w-[320px] rounded-[28px] bg-white px-6 py-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={springPremium}
          >
            <motion.div
              className="mb-4 flex min-h-[120px] items-end justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springPremium, delay: 0.06 }}
            >
              {bloomImageSrc ? (
                <MissionFlowerStageImage
                  src={bloomImageSrc}
                  alt={`${flower.nameKo} 개화`}
                  variant="hero"
                  className="max-h-[140px] drop-shadow-[0_12px_28px_rgba(15,23,42,0.2)]"
                />
              ) : (
                <span className="text-[52px] leading-none" aria-hidden>
                  {flower.emoji}
                </span>
              )}
            </motion.div>
            <h2 id="flower-bloom-title" className="sr-only">
              꽃 개화 축하
            </h2>
            <p className="text-[15px] font-semibold leading-relaxed tracking-[-0.2px] text-slate-800">
              이 꽃의 이름은 <span className="text-pink-600">{displayName}</span> 입니다,
              <br />
              꽃말은 <span className="text-violet-600">{m1}</span>,{' '}
              <span className="text-violet-600">{m2}</span> 입니다.
              <br />
              <span className="mt-3 block text-[16px] font-bold text-slate-900">열심히 하셨군요!</span>
            </p>
            <motion.button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 py-3 type-ink-button-lg text-white/95 shadow-lg shadow-pink-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={springPremium}
            >
              확인
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
