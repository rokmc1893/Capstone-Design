import { DAILY_REWARD_CAP_MESSAGE } from '../../store/useBloomMissionsStore';
import { typeCaptionXs } from '../../lib/typography';

type DailyRewardCapBannerProps = {
  className?: string;
};

/** 일일 경험치 상한 도달 시 상시 노출용 안내 */
export function DailyRewardCapBanner({ className = '' }: DailyRewardCapBannerProps) {
  return (
    <p
      className={`rounded-[12px] bg-black/25 px-3.5 py-2.5 ${typeCaptionXs} text-white/88 ring-1 ring-white/15 ${className}`}
      role="status"
      aria-live="polite"
    >
      {DAILY_REWARD_CAP_MESSAGE}
    </p>
  );
}
