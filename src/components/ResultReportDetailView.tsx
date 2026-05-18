import {
  Calendar,
  CircleDot,
  Dumbbell,
  Flame,
  HeartPulse,
  Moon,
  Scale,
  Wine,
} from 'lucide-react';
import {
  formatMissionFrequency,
  getDifficultyClassName,
  getDifficultyLabel,
  getRiskLevelClassName,
  getRiskLevelLabel,
} from '../lib/resultReport';
import type {
  ResultFactorAnalysis,
  ResultFactorCategory,
  ResultReport,
} from '../types/resultReport';

type ResultReportDetailViewProps = {
  report: ResultReport;
};

const cardClassName =
  'rounded-[22px] bg-white/12 p-4 shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl';

function CategoryIcon({ category }: { category: ResultFactorCategory }) {
  const className = 'h-4 w-4 shrink-0 text-white/90';

  switch (category) {
    case 'SMOKING':
      return <Flame className={className} />;
    case 'DRINKING':
      return <Wine className={className} />;
    case 'SLEEP':
      return <Moon className={className} />;
    case 'EXERCISE':
      return <Dumbbell className={className} />;
    case 'DISEASE':
      return <HeartPulse className={className} />;
    case 'AGE':
      return <Calendar className={className} />;
    case 'WEIGHT':
      return <Scale className={className} />;
    default:
      return <CircleDot className={className} />;
  }
}

function FactorAnalysisCard({ analysis }: { analysis: ResultFactorAnalysis }) {
  return (
    <article className="rounded-[18px] bg-white/10 p-3.5 ring-1 ring-white/20">
      <div className="flex items-start gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
          <CategoryIcon category={analysis.category} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-keep text-[14px] font-semibold text-white">{analysis.factor}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/80">{analysis.mateThought}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-white/70">{analysis.expectedChange}</p>
        </div>
      </div>
    </article>
  );
}

export function ResultReportDetailView({ report }: ResultReportDetailViewProps) {
  return (
    <div className="space-y-3 pb-2">
      <section className={cardClassName}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white/75">{report.nickname}</p>
            <p className="mt-1 text-[13px] text-white/85">
              {report.age}세 · {report.gender}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="type-report-score-sm">{report.score}</p>
            <p className="mt-1 text-[11px] text-white/75">건강 점수</p>
          </div>
        </div>
        <span
          className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${getRiskLevelClassName(report.riskLevel)}`}
        >
          {getRiskLevelLabel(report.riskLevel)}
        </span>
      </section>

      <section className={cardClassName}>
        <p className="break-keep text-[15px] font-semibold leading-relaxed text-white">
          {report.intro.greeting}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/85">{report.intro.scoreMessage}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/80">{report.intro.comfortMessage}</p>
      </section>

      <section className={cardClassName}>
        <p className="text-[12px] font-semibold text-white/85">컨디션</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-[16px] bg-white/10 px-3 py-2.5 ring-1 ring-white/20">
            <p className="text-[10px] text-white/70">수면</p>
            <p className="mt-1 break-keep text-[12px] font-medium text-white">
              {report.condition.sleepLabel}
            </p>
          </div>
          <div className="rounded-[16px] bg-white/10 px-3 py-2.5 ring-1 ring-white/20">
            <p className="text-[10px] text-white/70">스트레스</p>
            <p className="mt-1 break-keep text-[12px] font-medium text-white">
              {report.condition.stressLabel}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-white/80">{report.condition.summary}</p>
      </section>

      <section className={cardClassName}>
        <p className="text-[12px] font-semibold text-white/85">요인 분석</p>
        {report.factorAnalyses.length > 0 ? (
          <div className="mt-3 space-y-2.5">
            {report.factorAnalyses.map((analysis) => (
              <FactorAnalysisCard key={`${analysis.category}-${analysis.factor}`} analysis={analysis} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[12px] leading-relaxed text-white/75">
            현재까지는 주의할 건강 위험 요인이 크게 보이지 않아요.
          </p>
        )}
      </section>

      <section className={cardClassName}>
        <p className="text-[12px] font-semibold text-white/85">실천 미션</p>
        {report.missions.length > 0 ? (
          <ul className="mt-3 space-y-2.5">
            {report.missions.map((mission) => (
              <li
                key={`${mission.category}-${mission.title}`}
                className="rounded-[18px] bg-white/10 p-3.5 ring-1 ring-white/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 break-keep text-[14px] font-semibold text-white">
                    {mission.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${getDifficultyClassName(mission.difficulty)}`}
                  >
                    {getDifficultyLabel(mission.difficulty)}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-white/80">{mission.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 ring-1 ring-white/15">
                    {mission.linkedFactor}
                  </span>
                  <span>{formatMissionFrequency(mission.frequency, mission.duration)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[12px] text-white/75">---</p>
        )}
      </section>

      <section className={`${cardClassName} text-center`}>
        <p className="text-[13px] leading-relaxed text-white/90">{report.closing}</p>
      </section>
    </div>
  );
}
