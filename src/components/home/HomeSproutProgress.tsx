import { ChevronRight, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { GROWTH_STAGE_LABELS, getMissionFlower } from '../../data/missionFlowers';
import { glassHomeStatCard } from '../ui/glassStyles';
import { typeCaptionXs, typeStatLabel } from '../../lib/typography';
import { useBloomMissionsStore } from '../../store/useBloomMissionsStore';
import type { BloomStage } from '../../store/useBloomMissionsStore';

type HomeSproutProgressProps = {
  onPress?: () => void;
};

export function HomeSproutProgress({ onPress }: HomeSproutProgressProps) {
  const level = useBloomMissionsStore((s) => s.level);
  const xp = useBloomMissionsStore((s) => s.xp);
  const requiredExpForNext = useBloomMissionsStore((s) => s.requiredExpForNext);
  const selectedFlowerId = useBloomMissionsStore((s) => s.selectedFlowerId);

  const flower = getMissionFlower(selectedFlowerId);
  const stageLabel = GROWTH_STAGE_LABELS[level as BloomStage];
  const xpCap = requiredExpForNext ?? 100;
  const xpRounded = Math.round(xp);
  const xpBarPercent = Math.min(100, Math.max(0, xpCap > 0 ? (xp / xpCap) * 100 : 0));

  const content = (
    <>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/28"
        aria-hidden
      >
        <Sprout className="h-5 w-5 text-white/92" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate ${typeStatLabel}`}>
            레벨 {level}
            <span className="mx-1.5 text-white/40" aria-hidden>
              ·
            </span>
            <span className="text-white/88">{stageLabel}</span>
          </p>
          <span className={`shrink-0 tabular-nums ${typeCaptionXs} font-semibold text-white/78`}>
            {xpRounded} / {xpCap}
          </span>
        </div>
        <p className={`mt-0.5 truncate ${typeCaptionXs} text-white/62`}>
          {flower.emoji} {flower.nameKo} 키우는 중
        </p>
        <div
          className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/16 ring-1 ring-white/22"
          role="progressbar"
          aria-valuenow={xpRounded}
          aria-valuemin={0}
          aria-valuemax={xpCap}
          aria-label={`경험치 ${xpRounded} / ${xpCap}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-white/75 to-white/95 transition-[width] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ width: `${xpBarPercent}%` }}
          />
        </div>
      </div>

      {onPress ? (
        <ChevronRight className="h-5 w-5 shrink-0 text-white/55" strokeWidth={2} aria-hidden />
      ) : null}
    </>
  );

  const shellClass = [
    glassHomeStatCard,
    'flex w-full items-center gap-4 px-5 py-4',
    onPress ? 'text-left transition active:scale-[0.98]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (onPress) {
    return (
      <motion.button
        type="button"
        onClick={onPress}
        className={shellClass}
        aria-label={`성장 레벨 ${level}, 경험치 ${xpRounded} / ${xpCap}. 미션 화면으로 이동`}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.button>
    );
  }

  return <div className={shellClass}>{content}</div>;
}
