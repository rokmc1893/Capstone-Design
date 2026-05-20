import { useEffect, useState, type ReactNode } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { BottomTabNav } from '../components/BottomTabNav';
import { StatusBar } from '../components/StatusBar';

const riskColors = {
  low: '#22c55e',
  medium: '#f97316',
  high: '#ef4444',
};

const getRiskLevel = (risk: number) => {
  if (risk < 30) return 'low';
  if (risk < 60) return 'medium';
  return 'high';
};

function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[18px] bg-white/90 p-3 shadow-[0_8px_28px_rgba(32,32,32,0.07)] ring-1 ring-white/70 backdrop-blur-md sm:rounded-[22px] sm:p-4 ${className}`}
    >
      {children}
    </section>
  );
}

const Simulator = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'inspection';

  const isInspection = tab === 'inspection';
  const isBody = tab === 'body';
  const isActions = tab === 'actions';
  const {
    gender,
    age,
    bmi,
    sleepHours,
    smoking,
    alcohol,
    stressLevel,
    risk,
    topFactors,
    setGender,
    setAge,
    setBmi,
    setSleepHours,
    setSmoking,
    setAlcohol,
    setStressLevel,
  } = useSimulatorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    gender,
    age,
    bmi,
    sleepHours,
    smoking,
    alcohol,
    stressLevel,
  });

  useEffect(() => {
    if (isEditing) return;
    setDraft({
      gender,
      age,
      bmi,
      sleepHours,
      smoking,
      alcohol,
      stressLevel,
    });
  }, [isEditing, gender, age, bmi, sleepHours, smoking, alcohol, stressLevel]);

  const riskLevel = getRiskLevel(risk);

  const gaugeData = [
    { name: 'risk', value: risk },
    { name: 'rest', value: 100 - risk },
  ];

  const rangeAccent =
    'h-1 w-full cursor-pointer appearance-none rounded-full bg-gray100 accent-[#9388FA]';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-0 sm:p-4">
      {/* 실제 기기: 뷰포트 높이에 맞춰 스크롤은 내부만, 하단 탭은 항상 하단 고정 */}
      <div
        className="relative flex h-[100dvh] max-h-[852px] w-full max-w-[393px] flex-col overflow-hidden sm:rounded-[28px] sm:shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 shrink-0 pt-1.5 sm:pt-2">
          <StatusBar />
        </header>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="premium-scroll min-h-0 flex-1 overflow-x-hidden px-3 pb-24 pt-2 sm:px-4 sm:pb-28 sm:pt-3">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {/* 헤더 — 한 덩어리로 압축 */}
              <GlassCard className="!p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray400">
                      AI 건강 위험도 시뮬레이터
                    </p>
                    <h1 className="mt-0.5 break-keep text-base font-semibold leading-snug text-blackBg sm:text-lg">
                      {isActions
                        ? '검사 상세 리포트'
                        : isBody
                          ? '내 몸상태 조회'
                          : '오늘의 난임 고위험군 가능성'}
                    </h1>
                    <p className="mt-1 break-keep text-[11px] leading-snug text-gray400 sm:text-[12px]">
                      {isActions
                        ? '최근 검사 점수와 주요 요인 Top 3를 함께 보여드려요.'
                        : isBody
                          ? '최근 검사 결과와 위험 요인을 한눈에 정리합니다.'
                          : '생활 습관 기반 AI 예측입니다. 아래에서 What-if로 조절해 보세요.'}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-blackBg px-2.5 py-2 text-left text-[10px] text-white shadow-md sm:text-[11px]">
                    <p className="opacity-75">예측 기준 프로필</p>
                    <p className="mt-0.5 font-medium leading-tight">
                      {gender === 'female' ? '여성' : '남성'} · {age}세 · BMI{' '}
                      {bmi}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {(isInspection || isBody || isActions) && (
                <>
                  {/* AI 예측 + 요인: 한 카드에 게이지(작게) + 막대 + Top3 요약(가로 3칸) */}
                  <GlassCard>
                    <p className="mb-2 flex items-center justify-between text-[11px] font-semibold text-gray400 sm:text-xs">
                      <span>최근 검사 점수 · 주요 요인 Top 3</span>
                      <span className="text-[10px] font-medium text-gray400/80">
                        난임 고위험군 예측 결과
                      </span>
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
                      <div className="relative h-[92px] w-[160px] shrink-0 sm:h-[100px] sm:w-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={gaugeData}
                              startAngle={180}
                              endAngle={0}
                              innerRadius="70%"
                              outerRadius="100%"
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell key="risk" fill={riskColors[riskLevel]} />
                              <Cell key="rest" fill="#e5e7eb" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex -translate-y-1 flex-col items-center justify-center">
                          <span className="text-[9px] text-gray400">난임 고위험군</span>
                          <span className="text-lg font-semibold tabular-nums text-blackBg sm:text-xl">
                            {risk.toFixed(0)}%
                          </span>
                          <span className="mt-0.5 rounded-full bg-gray100 px-2 py-px text-[9px] font-medium text-gray400">
                            {riskLevel === 'low'
                              ? '낮음'
                              : riskLevel === 'medium'
                                ? '주의'
                                : '높음'}
                          </span>
                        </div>
                      </div>

                      <div className="grid w-full min-w-0 flex-1 grid-cols-3 gap-1.5">
                        {topFactors.map((factor, idx) => (
                          <div
                            key={`chip-${factor.label}`}
                            className="rounded-lg bg-white/70 px-1 py-2 text-center ring-1 ring-gray100/80"
                          >
                            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blackBg type-badge">
                              {idx + 1}
                            </span>
                            <p className="mt-1 truncate text-[10px] font-semibold leading-tight text-blackBg sm:text-[11px]">
                              {factor.label}
                            </p>
                            <p className="mt-0.5 text-[10px] tabular-nums text-gray400">
                              영향 {factor.value.toFixed(1)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}

              {isInspection && (
                <GlassCard>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-gray400 sm:text-xs">
                        What-if 시뮬레이터
                      </p>
                      <p className="mt-1 break-keep text-[10px] leading-snug text-gray400 sm:text-[11px]">
                        {isEditing
                          ? '값을 수정한 뒤 저장하면 위험도가 다시 계산됩니다.'
                          : '검사 완료 값입니다. 수정하기를 눌러 변경할 수 있어요.'}
                      </p>
                    </div>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="shrink-0 rounded-full bg-blackBg px-3 py-1.5 text-[10px] font-medium text-white sm:text-[11px]"
                      >
                        수정하기
                      </button>
                    ) : (
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft({
                              gender,
                              age,
                              bmi,
                              sleepHours,
                              smoking,
                              alcohol,
                              stressLevel,
                            });
                            setIsEditing(false);
                          }}
                          className="rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-blackBg ring-1 ring-gray100 sm:text-[11px]"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGender(draft.gender);
                            setAge(draft.age);
                            setBmi(draft.bmi);
                            setSleepHours(draft.sleepHours);
                            setSmoking(draft.smoking);
                            setAlcohol(draft.alcohol);
                            setStressLevel(draft.stressLevel);
                            setIsEditing(false);
                          }}
                          className="rounded-full bg-blackBg px-3 py-1.5 text-[10px] font-medium text-white sm:text-[11px]"
                        >
                          저장
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-3">
                    <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                      <p className="mb-1 text-[10px] font-medium text-gray400 sm:text-[11px]">
                        성별
                      </p>
                      <div className="inline-flex w-full rounded-full bg-gray100 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            isEditing &&
                            setDraft((prev) => ({ ...prev, gender: 'female' }))
                          }
                          disabled={!isEditing}
                          className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium transition sm:px-3 sm:py-2 sm:text-xs ${
                            draft.gender === 'female'
                              ? 'bg-white text-blackBg shadow-sm'
                              : 'text-gray400'
                          } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                          여성
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            isEditing &&
                            setDraft((prev) => ({ ...prev, gender: 'male' }))
                          }
                          disabled={!isEditing}
                          className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-medium transition sm:px-3 sm:py-2 sm:text-xs ${
                            draft.gender === 'male'
                              ? 'bg-white text-blackBg shadow-sm'
                              : 'text-gray400'
                          } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                          남성
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-0.5 text-[10px] text-gray400 sm:text-[11px]">
                          나이
                        </p>
                        <p className="text-xs font-semibold tabular-nums text-blackBg sm:text-sm">
                          {draft.age}
                          <span className="ml-0.5 text-[9px] font-normal text-gray200">
                            세
                          </span>
                        </p>
                        <input
                          type="range"
                          min={20}
                          max={45}
                          step={1}
                          value={draft.age}
                          onChange={(e) =>
                            isEditing &&
                            setDraft((prev) => ({
                              ...prev,
                              age: Number(e.target.value),
                            }))
                          }
                          disabled={!isEditing}
                          className={`mt-1 ${rangeAccent} ${!isEditing ? 'cursor-not-allowed opacity-55' : ''}`}
                        />
                      </div>
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-0.5 text-[10px] text-gray400 sm:text-[11px]">
                          BMI
                        </p>
                        <p className="text-xs font-semibold tabular-nums text-blackBg sm:text-sm">
                          {draft.bmi.toFixed(1)}
                        </p>
                        <input
                          type="range"
                          min={18}
                          max={30}
                          step={0.1}
                          value={draft.bmi}
                          onChange={(e) =>
                            isEditing &&
                            setDraft((prev) => ({
                              ...prev,
                              bmi: Number(e.target.value),
                            }))
                          }
                          disabled={!isEditing}
                          className={`mt-1 ${rangeAccent} ${!isEditing ? 'cursor-not-allowed opacity-55' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-0.5 text-[10px] text-gray400 sm:text-[11px]">
                          수면 시간
                        </p>
                        <p className="text-xs font-semibold tabular-nums text-blackBg sm:text-sm">
                          {draft.sleepHours.toFixed(1)}
                          <span className="ml-0.5 text-[9px] font-normal text-gray200">
                            시간
                          </span>
                        </p>
                        <input
                          type="range"
                          min={4}
                          max={9}
                          step={0.5}
                          value={draft.sleepHours}
                          onChange={(e) =>
                            isEditing &&
                            setDraft((prev) => ({
                              ...prev,
                              sleepHours: Number(e.target.value),
                            }))
                          }
                          disabled={!isEditing}
                          className={`mt-1 ${rangeAccent} ${!isEditing ? 'cursor-not-allowed opacity-55' : ''}`}
                        />
                      </div>
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-0.5 text-[10px] text-gray400 sm:text-[11px]">
                          스트레스
                        </p>
                        <p className="text-xs font-semibold tabular-nums text-blackBg sm:text-sm">
                          {draft.stressLevel}
                          <span className="ml-0.5 text-[9px] font-normal text-gray200">
                            /10
                          </span>
                        </p>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={1}
                          value={draft.stressLevel}
                          onChange={(e) =>
                            isEditing &&
                            setDraft((prev) => ({
                              ...prev,
                              stressLevel: Number(e.target.value),
                            }))
                          }
                          disabled={!isEditing}
                          className={`mt-1 ${rangeAccent} ${!isEditing ? 'cursor-not-allowed opacity-55' : ''}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-1 text-[10px] text-gray400 sm:text-[11px]">
                          흡연 빈도
                        </p>
                        <div className="flex gap-0.5 rounded-lg bg-gray100 p-0.5">
                          {(
                            [
                              { key: 'none', label: '비흡연' },
                              { key: 'sometimes', label: '가끔' },
                              { key: 'often', label: '자주' },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() =>
                                isEditing &&
                                setDraft((prev) => ({
                                  ...prev,
                                  smoking: opt.key,
                                }))
                              }
                              disabled={!isEditing}
                              className={`min-w-0 flex-1 rounded-md px-1 py-1 text-[9px] font-medium transition sm:text-[10px] ${
                                draft.smoking === opt.key
                                  ? 'bg-blackBg text-white shadow-sm'
                                  : 'text-gray400'
                              } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-gray100/70 p-2 sm:rounded-2xl sm:p-2.5">
                        <p className="mb-1 text-[10px] text-gray400 sm:text-[11px]">
                          음주 빈도
                        </p>
                        <div className="flex gap-0.5 rounded-lg bg-gray100 p-0.5">
                          {(
                            [
                              { key: 'none', label: '안 함' },
                              { key: 'sometimes', label: '가끔' },
                              { key: 'often', label: '자주' },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() =>
                                isEditing &&
                                setDraft((prev) => ({
                                  ...prev,
                                  alcohol: opt.key,
                                }))
                              }
                              disabled={!isEditing}
                              className={`min-w-0 flex-1 rounded-md px-1 py-1 text-[9px] font-medium transition sm:text-[10px] ${
                                draft.alcohol === opt.key
                                  ? 'bg-blackBg text-white shadow-sm'
                                  : 'text-gray400'
                              } ${!isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}

              {isActions && (
                <GlassCard>
                  <p className="text-[11px] font-semibold text-gray400 sm:text-xs">
                    오늘의 마이크로 가이드
                  </p>
                  <p className="mt-1 break-keep text-[10px] leading-snug text-gray400 sm:text-[11px]">
                    작은 행동을 꾸준히 실천하면 위험도 감소에 도움이 됩니다.
                  </p>
                  <div className="mt-2.5 space-y-2 sm:mt-3">
                    <div className="flex flex-col gap-1.5 rounded-lg bg-gray100/70 px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3 sm:py-2.5">
                      <div className="min-w-0 text-[11px] sm:text-xs">
                        <p className="font-semibold text-blackBg">
                          자기 전 5분 명상
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray400">
                          스트레스 완화에 도움
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 self-end rounded-full bg-blackBg px-2.5 py-1 text-[10px] font-medium text-white sm:self-auto sm:px-3 sm:py-1.5 sm:text-[11px]"
                      >
                        시작하기
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-lg bg-gray100/70 px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3 sm:py-2.5">
                      <div className="min-w-0 text-[11px] sm:text-xs">
                        <p className="font-semibold text-blackBg">
                          평일 10분 걷기
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray400">
                          BMI·수면 개선
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 self-end rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-blackBg sm:self-auto sm:px-3 sm:py-1.5 sm:text-[11px]"
                      >
                        계획에 추가
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 rounded-lg bg-gray100/70 px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:px-3 sm:py-2.5">
                      <div className="min-w-0 text-[11px] sm:text-xs">
                        <p className="font-semibold text-blackBg">
                          오늘은 무알콜 음료
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray400">
                          음주 빈도 조절
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 self-end rounded-full border border-gray100 bg-white px-2.5 py-1 text-[10px] font-medium text-blackBg sm:self-auto sm:px-3 sm:py-1.5 sm:text-[11px]"
                      >
                        실천 체크
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Simulator;
