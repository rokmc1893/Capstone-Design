import { Check, Info, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InspectionDateSwitcher } from './inspection/InspectionDateSwitcher';
import type { InspectionRound } from '../lib/inspectionArchive';
import { formatReportDateLong } from '../lib/reportFormat';
import type { HealthComparisonRow, HealthRecord } from '../types/healthReport';

type InspectionReportFullViewProps = {
  record: HealthRecord;
  inspectionRounds?: InspectionRound[];
};

const whiteCard =
  'rounded-[20px] bg-white px-4 py-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]';

function SectionIconBadge({ letter }: { letter: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7B6EE8] text-[12px] font-bold text-white">
      {letter}
    </span>
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
    <div className="-mx-6">
      {activeResultId != null && inspectionRounds.length > 1 ? (
        <div className="px-6 pb-2">
          <InspectionDateSwitcher
            rounds={inspectionRounds}
            activeResultId={activeResultId}
            className="rounded-[16px] bg-white/15 px-3 py-3 ring-1 ring-white/25"
          />
        </div>
      ) : null}

      {/* 목업: 보라 히어로 + HEALTH SCORE */}
      <section
        className="px-6 pb-8 pt-1 text-center text-white"
        aria-label="종합 건강 점수"
        style={{
          background:
            'linear-gradient(180deg, rgba(155,140,248,0.95) 0%, rgba(183,148,244,0.9) 55%, rgba(232,164,200,0.85) 100%)',
        }}
      >
        <p className="text-[11px] font-semibold tracking-[0.2em] text-white/85">HEALTH SCORE</p>
        <p className="mt-2 text-[40px] font-bold leading-none tracking-tight">
          {record.score}
          <span className="ml-1 text-[22px] font-semibold text-white/75">점</span>
          <span className="mx-2 text-[20px] font-medium text-white/50">/</span>
          <span className="text-[22px] font-semibold text-white/75">100점</span>
        </p>
        <div
          className="mx-auto mt-4 h-2.5 w-full max-w-[280px] overflow-hidden rounded-full bg-black/15"
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
        <p className="mt-4 text-[13px] leading-relaxed text-white/88">
          현재 건강 상태를 종합적으로 분석한 결과입니다
        </p>
        <button
          type="button"
          onClick={openArchiveForDate}
          className="mt-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-[13px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition active:scale-[0.98]"
        >
          {dateLabel}
        </button>
      </section>

      {/* 목업: 흰 시트 본문 */}
      <div className="space-y-3.5 rounded-t-[28px] bg-[#F5F5F7] px-5 pb-8 pt-5">
        {/* 설문 요약 */}
        <section className={whiteCard}>
          <div className="mb-3 flex items-center gap-2">
            <SectionIconBadge letter="A" />
            <h2 className="text-[16px] font-bold text-[#1a1a1f]">검사 설문지 답변 요약</h2>
          </div>
          <ul className="divide-y divide-[#EFEFEF]">
            {summaryRows.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-[14px] text-[#8E8E93]">{row.label}</span>
                <span className="text-right text-[14px] font-semibold text-[#1a1a1f]">{row.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 flex items-center justify-between border-t border-[#EFEFEF] pt-2.5">
            <span className="text-[14px] text-[#8E8E93]">스트레스 점수 (PSS)</span>
            <span className="text-[14px] font-semibold text-[#1a1a1f]">{record.pssScore}점</span>
          </div>
        </section>

        {/* 지표 비교 */}
        <section className={whiteCard}>
          <h2 className="text-[16px] font-bold text-[#1a1a1f]">지표 비교 분석</h2>
          {record.comparisonTable.length === 0 ? (
            <p className="mt-3 text-center text-[13px] text-[#8E8E93]">
              비교 데이터가 없습니다.
            </p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-[14px] ring-1 ring-[#EFEFEF]">
              <table className="w-full table-fixed text-left text-[13px]">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[22%]" />
                  <col className="w-[22%]" />
                  <col className="w-[34%]" />
                </colgroup>
                <thead>
                  <tr className="bg-[#F9FAFB] text-[12px] font-semibold text-[#6B7280]">
                    <th className="px-2.5 py-2.5">항목</th>
                    <th className="px-2.5 py-2.5">내 값</th>
                    <th className="px-2.5 py-2.5">평균</th>
                    <th className="px-2.5 py-2.5">비교</th>
                  </tr>
                </thead>
                <tbody>
                  {record.comparisonTable.map((row) => (
                    <tr key={`${row.label}-${row.myValue}`} className="border-t border-[#EFEFEF] bg-white">
                      <td className="whitespace-nowrap px-2.5 py-3 font-medium text-[#1a1a1f]">
                        {row.label}
                      </td>
                      <td className="whitespace-nowrap px-2.5 py-3 tabular-nums text-[#374151]">
                        {row.myValue}
                      </td>
                      <td className="whitespace-nowrap px-2.5 py-3 text-[#6B7280]">{row.avgValue}</td>
                      <td className="px-2.5 py-3">
                        <span
                          className={`inline-block max-w-full rounded-full px-2 py-0.5 text-[11px] font-semibold leading-snug break-keep ${comparisonPillClass(row)}`}
                        >
                          {row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 행동 가이드 */}
        {guideLines.length > 0 ? (
          <section
            className="rounded-[20px] px-4 py-4 text-white shadow-[0_8px_28px_rgba(123,110,232,0.25)]"
            style={{
              background: 'linear-gradient(135deg, #9B8CF8 0%, #B794F4 50%, #C4A8F0 100%)',
            }}
          >
            <h2 className="text-[16px] font-bold">행동 가이드</h2>
            <div className="mt-3 space-y-2.5">
              {guideLines.map((line, i) => (
                <p
                  key={i}
                  className="rounded-[14px] bg-white/15 px-3.5 py-2.5 text-[13px] leading-relaxed text-white/95 ring-1 ring-white/20"
                >
                  {line}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {/* AI 분석 */}
        {record.aiNarrative?.trim() ? (
          <section className={whiteCard}>
            <div className="mb-2.5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#7B6EE8]" aria-hidden />
              <h2 className="text-[16px] font-bold text-[#1a1a1f]">AI 맞춤형 분석</h2>
            </div>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#4B5563]">
              {record.aiNarrative}
            </p>
          </section>
        ) : null}

        {/* 핵심 리스크 */}
        {keyFactors.length > 0 ? (
          <section className={whiteCard}>
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#7B6EE8]" aria-hidden />
              <h2 className="text-[16px] font-bold text-[#1a1a1f]">핵심 리스크 요인</h2>
            </div>
            <ul className="space-y-2.5">
              {keyFactors.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-[14px] leading-relaxed text-[#374151]">{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => navigate('/missions')}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#7B6EE8] py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(123,110,232,0.35)] active:scale-[0.99]"
        >
          <Zap className="h-4 w-4" aria-hidden />
          미션에서 실천하기
        </button>

        <p className="pt-0.5 text-center text-[11px] leading-relaxed text-[#9CA3AF]">
          본 결과는 참고용이며, 정확한 진단은 의료 전문가와 상담해 주세요.
        </p>
      </div>
    </div>
  );
}
