type HomeScoreGaugeProps = {
  score: number;
  className?: string;
};

/** 홈 «최근 검사 결과» 점수 표시 (0~100 건강 점수) */
export function HomeScoreGauge({ score, className = '' }: HomeScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-[40px] font-bold leading-none tabular-nums tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
        {clamped}
      </span>
      <span className="mt-1.5 text-[13px] font-semibold text-white/80">점</span>
    </div>
  );
}
