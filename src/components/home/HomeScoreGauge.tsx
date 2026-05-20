import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type HomeScoreGaugeProps = {
  score: number;
  className?: string;
};

function scoreArcColor(score: number): string {
  if (score >= 70) return '#6ee7b7';
  if (score >= 50) return '#fcd34d';
  return '#f9a8d4';
}

/** 홈 «최근 검사 결과» 반원 게이지 (0~100 건강 점수) */
export function HomeScoreGauge({ score, className = '' }: HomeScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const data = [
    { name: 'score', value: clamped },
    { name: 'rest', value: 100 - clamped },
  ];

  return (
    <div className={`relative h-[88px] w-full max-w-[148px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius="68%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
          >
            <Cell fill={scoreArcColor(clamped)} />
            <Cell fill="rgba(255,255,255,0.12)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-0.5">
        <span className="text-2xl font-semibold tabular-nums leading-none text-white drop-shadow-sm">
          {clamped}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-white/75">점</span>
      </div>
    </div>
  );
}
