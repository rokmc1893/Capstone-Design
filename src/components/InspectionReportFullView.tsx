import { Moon, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { glassCard } from './ui/glassStyles';
import {
  typeBodySm,
  typeCaption,
  typeCaptionXs,
  typeCardTitle,
  typeReportBody,
  typeReportHeading,
  typeReportScore,
  typeReportScoreSm,
  typeReportSection,
} from '../lib/typography';
import type { HealthComparisonRow, HealthFactorCard, HealthRecord } from '../types/healthReport';

type InspectionReportFullViewProps = {
  record: HealthRecord;
};

const sectionCard = `${glassCard} p-5`;
const innerPanel = 'rounded-[16px] bg-black/12 ring-1 ring-white/12';

function ReportSectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-4">
      <h2 className={typeReportHeading}>{title}</h2>
      <p className={`mt-1.5 ${typeReportSection}`}>{description}</p>
    </header>
  );
}

function statusTone(status: HealthComparisonRow['status']): 'red' | 'blue' | 'green' {
  if (status === 'Normal') return 'green';
  if (status === 'Low') return 'blue';
  return 'red';
}

function ComparisonBadge({ row }: { row: HealthComparisonRow }) {
  const tone = statusTone(row.status);
  const label = row.status === 'Normal' ? '정상' : row.status === 'Low' ? '낮음' : '높음';
  const cls =
    tone === 'green'
      ? 'bg-emerald-500/30 text-emerald-50 ring-emerald-200/35'
      : tone === 'blue'
        ? 'bg-sky-500/30 text-sky-50 ring-sky-200/35'
        : 'bg-rose-500/30 text-rose-50 ring-rose-200/35';
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${cls}`}>
      {label}
    </span>
  );
}

function ComparisonResultText({ row }: { row: HealthComparisonRow }) {
  const tone = statusTone(row.status);
  const cls =
    tone === 'green' ? 'text-emerald-100' : tone === 'blue' ? 'text-sky-100' : 'text-rose-100';
  return <span className={`text-[12px] font-medium leading-snug ${cls}`}>{row.result}</span>;
}

function risksAsFallbackCards(risks: string[]): HealthFactorCard[] {
  return risks.map((line) => ({
    factor: line.length > 36 ? `${line.slice(0, 36)}…` : line,
    insight: line,
    expectedChange: '생활 습관을 조금씩 바꾸면 체감될 수 있어요.',
  }));
}

function RiskAnalysisCard({ card }: { card: HealthFactorCard }) {
  return (
    <article className={`${innerPanel} p-4`}>
      <p className={typeCardTitle}>{card.factor}</p>
      <div className="mt-3.5 space-y-2.5">
        <div className="rounded-[14px] bg-white/[0.08] px-3.5 py-3 ring-1 ring-white/10">
          <p className={`${typeCaptionXs} font-semibold uppercase tracking-wide text-white/55`}>
            데이터 인사이트
          </p>
          <p className={`mt-1.5 ${typeReportBody}`}>{card.insight}</p>
        </div>
        <div className="rounded-[14px] bg-white/[0.08] px-3.5 py-3 ring-1 ring-white/10">
          <p className={`${typeCaptionXs} font-semibold uppercase tracking-wide text-white/55`}>
            기대 변화
          </p>
          <p className={`mt-1.5 ${typeReportBody}`}>{card.expectedChange}</p>
        </div>
      </div>
    </article>
  );
}

function formatInspectedDate(iso: string): string {
  if (iso.length >= 10) {
    return iso.slice(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})/, '$1.$2.$3');
  }
  return iso;
}

export function InspectionReportFullView({ record }: InspectionReportFullViewProps) {
  const navigate = useNavigate();
  const { inputData } = record;
  const genderLabel = record.gender === 'male' ? '남성' : '여성';
  const inspectedLabel = formatInspectedDate(record.date);

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

  const factorCards: HealthFactorCard[] =
    record.factorCards && record.factorCards.length > 0
      ? record.factorCards
      : risksAsFallbackCards(record.risks);

  const pssLabel = `${record.pssScore}점 / 40점`;
  const scorePercent = Math.min(100, Math.max(0, record.score));

  const missionLines =
    record.missionPreviews && record.missionPreviews.length > 0
      ? record.missionPreviews.map((m) => `${m.title} — ${m.description}`)
      : record.guides;

  return (
    <div className="space-y-5 pb-2">
      {/* 종합 점수 */}
      <section
        className={`${glassCard} px-5 py-6 text-center shadow-[0_20px_48px_rgba(45,32,95,0.24)]`}
        aria-label="종합 건강 점수"
      >
        <p className={typeReportSection}>종합 건강 점수</p>
        <p className={`mt-3 ${typeReportScore}`}>
          {record.score}
          <span className="ml-1 text-[22px] font-semibold text-white/65">/ 100</span>
        </p>
        <div
          className="mx-auto mt-5 h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-black/20 ring-1 ring-white/25"
          role="progressbar"
          aria-valuenow={scorePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-white via-white/85 to-white/55 transition-[width] duration-700 ease-out"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <p className={`mt-4 ${typeBodySm} text-white/78`}>
          현재 건강 상태를 종합적으로 분석한 결과입니다
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex rounded-full bg-white/18 px-3.5 py-1.5 text-[11px] font-semibold tabular-nums text-white/92 ring-1 ring-white/28">
            검사일 {inspectedLabel}
          </span>
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/75 ring-1 ring-white/18">
            {record.year}년 {record.month}월 · {record.week}주차
          </span>
        </div>
      </section>

      {/* 설문 요약 */}
      <section className={sectionCard} aria-labelledby="report-summary">
        <ReportSectionHeader
          title="검사 설문지 답변 요약"
          description="검사에 제출한 답변을 항목별로 정리했습니다"
        />
        <ul
          id="report-summary"
          className={`${innerPanel} divide-y divide-white/10 overflow-hidden`}
        >
          {summaryRows.map((row) => (
            <li
              key={row.label}
              className="flex items-start justify-between gap-4 px-4 py-3 first:pt-3 last:pb-3"
            >
              <span className={`shrink-0 ${typeBodySm} text-white/72`}>{row.label}</span>
              <span className={`max-w-[55%] text-right ${typeCardTitle} text-[14px]`}>{row.value}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-4 flex items-center justify-between ${innerPanel} px-4 py-3.5`}>
          <span className={typeCardTitle}>스트레스 점수 (PSS)</span>
          <span className={typeReportScoreSm}>{record.pssScore}점</span>
        </div>
      </section>

      {/* 생활 지표 */}
      <section className={sectionCard} aria-labelledby="report-lifestyle">
        <ReportSectionHeader
          title="생활 지표 분석"
          description="수면·스트레스 등 생활 리듬을 요약합니다"
        />
        <div id="report-lifestyle" className="grid grid-cols-2 gap-3">
          <div className={`flex gap-3 ${innerPanel} px-3.5 py-3.5`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-400/35 text-white ring-1 ring-white/20">
              <Moon className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className={typeCaption}>수면</p>
              <p className={`mt-1 ${typeCardTitle} text-[14px] leading-snug`}>{inputData.sleep}</p>
            </div>
          </div>
          <div className={`flex gap-3 ${innerPanel} px-3.5 py-3.5`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400/35 text-white ring-1 ring-white/20">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className={typeCaption}>스트레스</p>
              <p className={`mt-1 ${typeCardTitle} text-[14px] leading-snug tabular-nums`}>{pssLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className={`${typeCardTitle} text-[14px]`}>동일 연령·성별 대비</h3>
          <p className={`mt-1 ${typeCaption}`}>참고 평균과 비교한 값입니다</p>
          <div className="mt-3 overflow-x-auto rounded-[16px] ring-1 ring-white/15 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {record.comparisonTable.length === 0 ? (
              <p
                className={`${innerPanel} px-4 py-8 text-center ${typeBodySm} text-white/75`}
              >
                동일 연령·성별 평균 비교 데이터는 서버에서 내려주면 표시됩니다.
              </p>
            ) : (
              <table className="w-full min-w-[300px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-black/18 text-[11px] font-semibold text-white/72">
                    <th className="rounded-tl-[14px] px-3 py-3">항목</th>
                    <th className="px-3 py-3">내 값</th>
                    <th className="px-3 py-3">평균</th>
                    <th className="rounded-tr-[14px] px-3 py-3">비교</th>
                  </tr>
                </thead>
                <tbody>
                  {record.comparisonTable.map((row) => (
                    <tr
                      key={`${row.label}-${row.myValue}`}
                      className="border-t border-white/10 bg-white/[0.05] text-[12px] text-white/90"
                    >
                      <td className="px-3 py-3 font-medium text-white">{row.label}</td>
                      <td className="px-3 py-3 tabular-nums text-white/88">{row.myValue}</td>
                      <td className="px-3 py-3 text-white/78">{row.avgValue}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col items-start gap-1.5">
                          <ComparisonResultText row={row} />
                          <ComparisonBadge row={row} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {record.comparisonTable.length > 0 ? (
            <p className={`mt-3 text-center ${typeCaptionXs} text-white/50`}>
              비교 결과는 서버에서 (내 값 − 평균) ÷ 평균 기준으로 산출됩니다.
            </p>
          ) : null}
        </div>
      </section>

      {/* 리스크 */}
      <section className={sectionCard}>
        <ReportSectionHeader
          title="핵심 리스크 분석"
          description="데이터 인사이트와 기대 변화를 함께 확인해 보세요"
        />
        <div className="space-y-3">
          {factorCards.length === 0 ? (
            <p className={`${innerPanel} px-4 py-8 text-center ${typeBodySm} text-white/75`}>
              표시할 핵심 리스크가 없습니다.
            </p>
          ) : (
            factorCards.map((c, i) => <RiskAnalysisCard key={`${c.factor}-${i}`} card={c} />)
          )}
        </div>
      </section>

      {/* AI 코멘트 */}
      {record.aiNarrative?.trim() ? (
        <section className={sectionCard}>
          <ReportSectionHeader title="맞춤형 건강 코멘트" description="검사 결과를 바탕으로 한 안내입니다" />
          <div className={`${innerPanel} px-4 py-4`}>
            <p className={`whitespace-pre-line ${typeReportBody}`}>{record.aiNarrative}</p>
          </div>
        </section>
      ) : null}

      {/* 미션 가이드 */}
      <section className={`${sectionCard} ring-2 ring-white/30`}>
        <ReportSectionHeader
          title="미리 보는 미션 가이드"
          description="미션 화면에서 같은 실천을 이어갈 수 있어요"
        />
        <ul className="space-y-2.5">
          {missionLines.length === 0 ? (
            <li className={`${innerPanel} px-4 py-5 text-center ${typeBodySm} text-white/75`}>
              제안된 미션 가이드가 없습니다. 미션 탭에서 루틴을 시작해 보세요.
            </li>
          ) : (
            missionLines.map((line, i) => (
              <li
                key={i}
                className={`flex gap-3 ${innerPanel} px-4 py-3 ${typeReportBody}`}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/25 text-[11px] text-emerald-100 ring-1 ring-emerald-200/30"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="min-w-0 flex-1">{line}</span>
              </li>
            ))
          )}
        </ul>
        <button
          type="button"
          onClick={() => navigate('/missions')}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3.5 text-[15px] font-semibold text-[#7B6EE8] shadow-[0_12px_32px_rgba(50,35,100,0.25)] ring-1 ring-white transition active:scale-[0.99]"
        >
          <Target className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          미션 화면에서 실천하기
        </button>
      </section>

      <p className={`px-2 pb-1 text-center ${typeCaptionXs} text-white/55`}>
        본 결과는 참고용이며, 정확한 진단은 의료 전문가와 상담해 주세요.
      </p>
    </div>
  );
}
