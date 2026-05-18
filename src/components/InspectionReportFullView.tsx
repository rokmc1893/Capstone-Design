import { Moon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HealthComparisonRow, HealthFactorCard, HealthRecord } from '../types/healthReport';

type InspectionReportFullViewProps = {
  record: HealthRecord;
};

const cardClass =
  'rounded-[20px] bg-white/[0.14] p-4 shadow-[0_14px_36px_rgba(45,32,95,0.22)] ring-1 ring-white/25 backdrop-blur-xl';

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
      ? 'bg-emerald-500/25 text-emerald-50 ring-emerald-200/40'
      : tone === 'blue'
        ? 'bg-sky-500/25 text-sky-50 ring-sky-200/40'
        : 'bg-rose-500/25 text-rose-50 ring-rose-200/40';
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${cls}`}>
      {label}
    </span>
  );
}

function ComparisonResultText({ row }: { row: HealthComparisonRow }) {
  const tone = statusTone(row.status);
  const cls =
    tone === 'green'
      ? 'text-emerald-100'
      : tone === 'blue'
        ? 'text-sky-100'
        : 'text-rose-100';
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
    <div className="rounded-[16px] bg-black/15 p-3.5 ring-1 ring-white/12">
      <p className="type-card-title">{card.factor}</p>
      <div className="mt-3 space-y-2">
        <div className="rounded-[12px] bg-white/[0.08] px-3 py-2.5 ring-1 ring-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">데이터 인사이트</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/88">{card.insight}</p>
        </div>
        <div className="rounded-[12px] bg-white/[0.08] px-3 py-2.5 ring-1 ring-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">기대 변화</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/88">{card.expectedChange}</p>
        </div>
      </div>
    </div>
  );
}

export function InspectionReportFullView({ record }: InspectionReportFullViewProps) {
  const navigate = useNavigate();
  const { inputData } = record;
  const genderLabel = record.gender === 'male' ? '남성' : '여성';

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

  return (
    <div className="space-y-4 pb-6">
      <section className="rounded-[22px] bg-white/[0.12] px-4 py-6 text-center shadow-[0_16px_40px_rgba(45,32,95,0.2)] ring-1 ring-white/25 backdrop-blur-xl">
        <p className="text-[13px] font-medium text-white/85">종합 건강 점수</p>
        <p className="mt-2 type-report-score">
          총점 {record.score}점 <span className="text-[20px] font-semibold text-white/70">/ 100점</span>
        </p>
        <div className="mx-auto mt-4 h-2.5 w-full max-w-[260px] overflow-hidden rounded-full bg-black/15 ring-1 ring-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-white/90 to-white/60 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, record.score))}%` }}
          />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-white/78">
          현재 건강 상태를 종합적으로 분석한 결과입니다
        </p>
        <p className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white/90 ring-1 ring-white/25">
          {record.year}년 {record.month}월 {record.week}주차
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="type-report-heading">검사 설문지 답변 요약</h2>
        <p className="mt-1 text-[12px] text-white/70">검사에 제출한 답변을 항목별로 정리했습니다</p>
        <ul className="mt-4 divide-y divide-white/10 rounded-[14px] bg-black/10 ring-1 ring-white/10">
          {summaryRows.map((row) => (
            <li key={row.label} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <span className="text-[13px] text-white/75">{row.label}</span>
              <span className="max-w-[58%] text-right text-[13px] font-semibold text-white">{row.value}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between rounded-[14px] bg-white/[0.08] px-3 py-3 ring-1 ring-white/12">
          <span className="text-[13px] font-semibold text-white">스트레스 점수 (PSS)</span>
          <span className="type-report-score-sm">{record.pssScore}점</span>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="type-report-heading">생활 지표 분석</h2>
        <p className="mt-1 text-[12px] text-white/70">수면·스트레스 등 생활 리듬을 요약합니다</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex gap-3 rounded-[16px] bg-black/12 px-3 py-3 ring-1 ring-white/12">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-white">
              <Moon className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white/65">수면</p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-white">{inputData.sleep}</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-[16px] bg-black/12 px-3 py-3 ring-1 ring-white/12">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/30 text-white">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white/65">스트레스 (PSS)</p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-white">{pssLabel}</p>
            </div>
          </div>
        </div>

        <h3 className="mt-5 text-[12px] font-bold text-white/90">동일 연령·성별 대비</h3>
        <p className="mt-1 text-[11px] text-white/65">참고 평균과 비교한 값입니다</p>
        <div className="mt-2 overflow-x-auto rounded-[14px] ring-1 ring-white/15 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {record.comparisonTable.length === 0 ? (
            <p className="rounded-[14px] bg-black/10 px-4 py-6 text-center text-[12px] leading-relaxed text-white/75 ring-1 ring-white/10">
              동일 연령·성별 평균 비교 데이터는 서버에서 내려주면 표시됩니다.
            </p>
          ) : (
            <table className="w-full min-w-[320px] border-separate border-spacing-0 text-left text-[12px]">
              <thead>
                <tr className="bg-black/15 text-[11px] font-semibold uppercase tracking-wide text-white/75">
                  <th className="rounded-tl-[12px] px-2 py-2.5">항목</th>
                  <th className="px-2 py-2.5">내 값</th>
                  <th className="px-2 py-2.5">평균</th>
                  <th className="rounded-tr-[12px] px-2 py-2.5">비교</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                {record.comparisonTable.map((row) => (
                  <tr key={`${row.label}-${row.myValue}`} className="border-t border-white/10 bg-white/[0.04]">
                    <td className="px-2 py-2.5 font-medium text-white">{row.label}</td>
                    <td className="px-2 py-2.5 tabular-nums text-white/85">{row.myValue}</td>
                    <td className="px-2 py-2.5 text-white/80">{row.avgValue}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex flex-col items-start gap-1">
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
          <p className="mt-3 text-center text-[10px] leading-relaxed text-white/55">
            *비교 결과는 (내 값 − 평균) ÷ 평균 × 100을 기준으로 서버에서 산출됩니다.
          </p>
        ) : null}
      </section>

      <section className={cardClass}>
        <h2 className="type-report-heading">핵심 리스크 분석</h2>
        <p className="mt-1 text-[12px] text-white/70">데이터 인사이트와 기대 변화를 함께 확인해 보세요</p>
        <div className="mt-4 space-y-3">
          {factorCards.length === 0 ? (
            <p className="rounded-[14px] bg-black/10 px-4 py-5 text-center text-[12px] text-white/75 ring-1 ring-white/10">
              표시할 핵심 리스크가 없습니다.
            </p>
          ) : (
            factorCards.map((c, i) => <RiskAnalysisCard key={i} card={c} />)
          )}
        </div>
      </section>

      {record.aiNarrative?.trim() ? (
        <section className={cardClass}>
          <h2 className="type-report-heading">맞춤형 건강 코멘트</h2>
          <p className="mt-1 text-[11px] font-medium text-white/60">AI 분석</p>
          <p className="mt-4 whitespace-pre-line text-[13px] leading-[1.65] text-white/88">{record.aiNarrative}</p>
        </section>
      ) : null}

      <section className={`${cardClass} ring-2 ring-white/35`}>
        <h2 className="type-report-heading">미리 보는 미션 가이드</h2>
        <p className="mt-1 text-[12px] text-white/70">미션 화면에서 같은 실천을 이어갈 수 있어요</p>
        <ul className="mt-4 space-y-2.5">
          {(record.missionPreviews && record.missionPreviews.length > 0
            ? record.missionPreviews.map((m) => ({ line: `${m.title} — ${m.description}` }))
            : record.guides.map((g) => ({ line: g }))
          ).length === 0 ? (
            <li className="rounded-[14px] bg-white/[0.06] px-3 py-4 text-center text-[12px] text-white/75 ring-1 ring-white/10">
              제안된 미션 가이드가 없습니다. 미션 탭에서 루틴을 시작해 보세요.
            </li>
          ) : (
            (record.missionPreviews && record.missionPreviews.length > 0
              ? record.missionPreviews.map((m) => ({ line: `${m.title} — ${m.description}` }))
              : record.guides.map((g) => ({ line: g }))
            ).map(({ line }, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-[14px] bg-white/[0.08] px-3 py-2.5 text-[13px] leading-relaxed text-white/90 ring-1 ring-white/12"
              >
                <span className="mt-0.5 shrink-0 text-[#C8F5A8]">✓</span>
                <span>{line}</span>
              </li>
            ))
          )}
        </ul>
        <button
          type="button"
          onClick={() => navigate('/missions')}
          className="mt-5 w-full rounded-full bg-white/20 py-3 type-body-sm font-semibold text-white/90 ring-1 ring-white/35 backdrop-blur-md transition active:scale-[0.99]"
        >
          미션 화면에서 실천하기
        </button>
      </section>

      <p className="px-1 text-center text-[11px] leading-relaxed text-white/65">
        본 결과는 참고용이며 정확한 진단은 병원을 방문해 주세요
      </p>
    </div>
  );
}
