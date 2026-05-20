import type { ReactNode } from 'react';
import { AlertCircle, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InspectionDateSwitcher } from './inspection/InspectionDateSwitcher';
import type { InspectionRound } from '../lib/inspectionArchive';
import { formatReportDateLong } from '../lib/reportFormat';
import type { HealthComparisonRow, HealthFactorCard, HealthRecord } from '../types/healthReport';

type InspectionReportFullViewProps = {
  record: HealthRecord;
  inspectionRounds?: InspectionRound[];
};

const reportCard =
  'rounded-[18px] bg-white px-5 py-5 shadow-[0_2px_16px_rgba(2,32,71,0.06)]';

const sheetShell = 'rounded-t-[24px] bg-[#F2F4F6] px-5 pb-10 pt-6';

function SectionIconBadge({ letter }: { letter: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#7B6EE8] text-[13px] font-bold text-white">
      {letter}
    </span>
  );
}

function ReportSectionTitle({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {icon}
      <h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#191F28]">{children}</h2>
    </div>
  );
}

const riskIconWell =
  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] ring-1 ring-[#FECACA]';

function RiskFactorBulletList({ factors }: { factors: string[] }) {
  return (
    <ul className="space-y-3">
      {factors.map((line, i) => (
        <li
          key={i}
          className="flex gap-3.5 rounded-[14px] border border-[#FECACA]/60 bg-[#FFF5F5] px-4 py-3.5"
        >
          <span className={riskIconWell} aria-hidden>
            <AlertCircle className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-medium leading-[1.55] text-[#991B1B]">
            {line}
          </span>
        </li>
      ))}
    </ul>
  );
}

function RiskFactorDetailCards({ cards }: { cards: HealthFactorCard[] }) {
  return (
    <div className="space-y-4">
      {cards.map((card, i) => (
        <article
          key={`${card.factor}-${i}`}
          className="overflow-hidden rounded-[14px] border border-[#FECACA]/70 bg-[#FFFBFB] pb-4"
        >
          <div className="flex items-center gap-2.5 px-4 pt-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626] ring-1 ring-[#FECACA]">
              <AlertCircle className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </span>
            <h3 className="text-[15px] font-semibold text-[#191F28]">{card.factor}</h3>
          </div>
          {card.insight.trim() ? (
            <div className="mx-4 mt-3 rounded-[12px] bg-[#FFF1F2] px-3.5 py-3 ring-1 ring-[#FECACA]/50">
              <span className="text-[10px] font-bold tracking-[0.06em] text-[#DC2626]">
                MATE INSIGHT
              </span>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-[#4E5968]">{card.insight}</p>
            </div>
          ) : null}
          {card.expectedChange.trim() ? (
            <div className="mx-4 mt-3 rounded-[12px] bg-white px-3.5 py-3 ring-1 ring-[#E5E8EB]">
              <span className="text-[10px] font-bold tracking-[0.06em] text-[#DC2626]/85">
                EXPECTED CHANGE
              </span>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-[#7C2D12]/90">
                {card.expectedChange}
              </p>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function comparisonPillClass(row: HealthComparisonRow): string {
  const r = row.result;
  if (row.status === 'High' || r.includes('위험') || r.includes('+')) {
    return 'bg-[#FEE2E2] text-[#DC2626]';
  }
  if (row.status === 'Low' || r.includes('-') || r.includes('낮')) {
    return 'bg-[#DBEAFE] text-[#2563EB]';
  }
  if (r.includes('좋') || r.includes('양호')) {
    return 'bg-[#D1FAE5] text-[#059669]';
  }
  return 'bg-[#F3F4F6] text-[#4B5563]';
}

export function InspectionReportFullView({
  record,
  inspectionRounds = [],
}: InspectionReportFullViewProps) {
  const navigate = useNavigate();
  const { inputData } = record;
  const genderLabel = record.gender === 'male' ? '남성' : '여성';
  const activeResultId = record.resultId ?? null;
  const dateLabel = formatReportDateLong(record.date, record.week);
  const scorePercent = Math.min(100, Math.max(0, record.score));

  const openArchiveForDate = () => {
    const [y, m] = record.date.split('-');
    const year = parseInt(y, 10);
    const month = parseInt(m, 10);
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      navigate('/inspection-reports/archive');
      return;
    }
    navigate(
      `/inspection-reports/archive?year=${year}&month=${month}&day=${record.date.slice(0, 10)}`,
    );
  };

  const summaryRows: { label: string; value: string }[] = [
    { label: '나이', value: `${inputData.age}세` },
    { label: '성별', value: genderLabel },
    { label: '키 / 몸무게', value: `${inputData.height}cm / ${inputData.weight}kg` },
  ];

  if (record.gender === 'female') {
    if (inputData.pregnancyExperience != null) {
      summaryRows.push({ label: '임신/출산 경험', value: inputData.pregnancyExperience });
    }
    if (inputData.firstPeriodAge != null) {
      summaryRows.push({ label: '초경 나이', value: `${inputData.firstPeriodAge}세` });
    }
  }

  if (inputData.sexualActivity != null) {
    summaryRows.push({ label: '성관계 여부', value: inputData.sexualActivity });
  }

  summaryRows.push(
    { label: '흡연 빈도', value: inputData.smoking },
    { label: '음주 빈도', value: inputData.drinking },
    { label: '수면 시간', value: inputData.sleep },
  );

  const keyFactors =
    record.risks.length > 0
      ? record.risks
      : (record.factorCards ?? []).map((c) => c.factor);

  const guideLines =
    record.guides.length > 0
      ? record.guides
      : (record.missionPreviews ?? []).map((m) => `${m.title}. ${m.description}`);

  return (
    <div>
      {activeResultId != null && inspectionRounds.length > 1 ? (
        <div className="px-5 pb-3">
          <InspectionDateSwitcher
            rounds={inspectionRounds}
            activeResultId={activeResultId}
            className="rounded-[14px] bg-white/15 px-4 py-3.5 ring-1 ring-white/25"
          />
        </div>
      ) : null}

      <section
        className="px-5 pb-10 pt-2 text-center text-white"
        aria-label="종합 건강 점수"
        style={{
          background:
            'linear-gradient(180deg, rgba(155,140,248,0.95) 0%, rgba(183,148,244,0.9) 55%, rgba(232,164,200,0.85) 100%)',
        }}
      >
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/85">HEALTH SCORE</p>
        <p className="mt-3 text-[40px] font-bold leading-none tracking-tight">
          {record.score}
          <span className="ml-1 text-[22px] font-semibold text-white/75">점</span>
          <span className="mx-2 text-[20px] font-medium text-white/50">/</span>
          <span className="text-[22px] font-semibold text-white/75">100점</span>
        </p>
        <div
          className="mx-auto mt-5 h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-black/12"
          role="progressbar"
          aria-valuenow={scorePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-white transition-[width] duration-700"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <p className="mx-auto mt-5 max-w-[300px] text-[14px] leading-[1.55] text-white/88">
          현재 건강 상태를 종합적으로 분석한 결과입니다
        </p>
        <button
          type="button"
          onClick={openArchiveForDate}
          className="mt-5 inline-flex rounded-full bg-white/20 px-5 py-2.5 text-[13px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition active:scale-[0.98]"
        >
          {dateLabel}
        </button>
      </section>

      <div className={`${sheetShell} space-y-4`}>
        <section className={reportCard}>
          <ReportSectionTitle icon={<SectionIconBadge letter="A" />}>
            검사 설문지 답변 요약
          </ReportSectionTitle>
          <ul className="divide-y divide-[#E5E8EB]">
            {summaryRows.map((row) => (
              <li
                key={row.label}
                className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0"
              >
                <span className="shrink-0 text-[15px] leading-snug text-[#8B95A1]">{row.label}</span>
                <span className="text-right text-[15px] font-medium leading-snug text-[#191F28]">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between gap-6 border-t border-[#E5E8EB] pt-4">
            <span className="text-[15px] text-[#8B95A1]">스트레스 점수 (PSS)</span>
            <span className="text-[15px] font-medium text-[#191F28]">{record.pssScore}점</span>
          </div>
        </section>

        <section className={reportCard}>
          <ReportSectionTitle>지표 비교 분석</ReportSectionTitle>
          {record.comparisonTable.length === 0 ? (
            <p className="py-2 text-center text-[14px] text-[#8B95A1]">비교 데이터가 없습니다.</p>
          ) : (
            <ul className="space-y-2.5">
              {record.comparisonTable.map((row) => (
                <li
                  key={`${row.label}-${row.myValue}`}
                  className="rounded-[14px] bg-[#F9FAFB] px-4 py-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-semibold text-[#191F28]">{row.label}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-snug break-keep ${comparisonPillClass(row)}`}
                    >
                      {row.result}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#8B95A1]">
                    <span>
                      내 값{' '}
                      <strong className="font-semibold tabular-nums text-[#333D4B]">
                        {row.myValue}
                      </strong>
                    </span>
                    <span>
                      평균{' '}
                      <strong className="font-semibold tabular-nums text-[#333D4B]">
                        {row.avgValue}
                      </strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {guideLines.length > 0 ? (
          <section
            className="rounded-[18px] px-5 py-5 text-white shadow-[0_4px_20px_rgba(123,110,232,0.2)]"
            style={{
              background: 'linear-gradient(135deg, #9B8CF8 0%, #B794F4 50%, #C4A8F0 100%)',
            }}
          >
            <h2 className="text-[17px] font-bold tracking-[-0.02em]">행동 가이드</h2>
            <div className="mt-4 space-y-2.5">
              {guideLines.map((line, i) => (
                <p
                  key={i}
                  className="rounded-[14px] bg-white/15 px-4 py-3 text-[14px] leading-[1.55] text-white/95 ring-1 ring-white/20"
                >
                  {line}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {record.aiNarrative?.trim() ? (
          <section className={reportCard}>
            <ReportSectionTitle icon={<Sparkles className="h-6 w-6 text-[#7B6EE8]" aria-hidden />}>
              AI 맞춤형 분석
            </ReportSectionTitle>
            <p className="whitespace-pre-line text-[15px] leading-[1.65] text-[#4E5968]">
              {record.aiNarrative}
            </p>
          </section>
        ) : null}

        {keyFactors.length > 0 ? (
          <section className={reportCard}>
            <ReportSectionTitle
              icon={<AlertCircle className="h-6 w-6 text-[#DC2626]" strokeWidth={2.25} aria-hidden />}
            >
              핵심 리스크 요인
            </ReportSectionTitle>
            {record.factorCards && record.factorCards.length > 0 ? (
              <RiskFactorDetailCards cards={record.factorCards} />
            ) : (
              <RiskFactorBulletList factors={keyFactors} />
            )}
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => navigate('/missions')}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#7B6EE8] py-4 text-[16px] font-semibold text-white shadow-[0_6px_20px_rgba(123,110,232,0.28)] active:scale-[0.99]"
        >
          <Zap className="h-4 w-4" aria-hidden />
          미션에서 실천하기
        </button>

        <p className="px-1 pt-1 text-center text-[12px] leading-[1.55] text-[#8B95A1]">
          본 결과는 참고용이며, 정확한 진단은 의료 전문가와 상담해 주세요.
        </p>
      </div>
    </div>
  );
}
