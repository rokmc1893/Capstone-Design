import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ClipboardList, Activity, Heart } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { BottomTabNav } from '../components/BottomTabNav';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

const Home = () => {
  const navigate = useNavigate();
  const userName = useUserProfileStore((s) => s.name);
  const risk = useSimulatorStore((s) => s.risk);
  const topFactors = useSimulatorStore((s) => s.topFactors);

  const riskLevel = risk < 30 ? 'low' : risk < 60 ? 'medium' : 'high';
  const gaugeData = [
    { name: 'risk', value: risk },
    { name: 'rest', value: Math.max(0, 100 - risk) },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        className="relative w-[390px] h-[844px] overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        {/* 설정 화면과 동일한 배경(그라데이션 + 소프트 글로우) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        {/* 상단 바 */}
        <div className="relative z-10 flex items-start justify-between px-6 pt-12">
          <div className="min-w-0">
            <p className="text-[16px] leading-[22px] font-bold tracking-[-0.2px] text-white">
              반가워요, {userName} 님!
            </p>
            <p className="mt-2 text-[24px] font-bold leading-[30px] tracking-[-0.4px] text-white">
              오늘 하루도
              <br />
              좋은 결과가 있길
            </p>
          </div>
          <button
            type="button"
            aria-label="설정"
            onClick={() => navigate('/settings')}
            className="relative ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/50 backdrop-blur-md active:scale-[0.98]"
          >
            <SettingsIcon className="h-5 w-5 text-blackBg" />
          </button>
        </div>

        {/* 메인 액션 (검사하기 / 검사 상세 리포트) */}
        <div className="relative z-10 mt-8 px-6 pb-28">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/inspection')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div>
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사하기
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  현재 상태를 간편하게 체크합니다
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <ClipboardList className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/simulator?tab=actions')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div>
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사 상세 리포트
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  최근 점수와 주요 요인을 한눈에
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <Heart className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>
          </div>

          {/* 내 몸상태 한눈에 보기 섹션 */}
          <div className="mt-7 rounded-[24px] bg-white/18 px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.35)] ring-1 ring-white/35 backdrop-blur-xl">
            <p className="text-[13px] font-semibold text-white/90">내 몸상태 조회</p>
            <p className="mt-0.5 text-[11px] text-white/75">
              최근 검사 결과와 주요 요인을 홈에서 바로 확인해요.
            </p>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              {/* 게이지 · 최근 점수 */}
              <div className="flex flex-1 flex-col items-center sm:items-start">
                <div className="relative h-[90px] w-[150px]">
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
                        <Cell
                          key="risk"
                          fill={
                            riskLevel === 'low'
                              ? '#4ade80'
                              : riskLevel === 'medium'
                                ? '#facc15'
                                : '#fb7185'
                          }
                        />
                        <Cell key="rest" fill="rgba(255,255,255,0.45)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex -translate-y-1 flex-col items-center justify-center">
                    <span className="text-[9px] text-white/80">최근 검사 결과</span>
                    <span className="text-[22px] font-bold tabular-nums text-white">
                      {risk.toFixed(0)}점
                    </span>
                    <span className="mt-0.5 rounded-full bg-white/20 px-2 py-px text-[9px] font-medium text-white/90">
                      {riskLevel === 'low'
                        ? '양호'
                        : riskLevel === 'medium'
                          ? '주의'
                          : '고위험'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 주요 요인 Top 3 */}
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-white/90">주요 요인</p>
                <div className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] text-white/85">
                  {topFactors.slice(0, 3).map((factor, idx) => (
                    <div
                      key={factor.label}
                      className="flex items-center justify-between rounded-[14px] bg-white/12 px-2.5 py-1.5 ring-1 ring-white/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] font-bold text-[#9388FA]">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-medium">
                          {factor.label}
                        </span>
                      </div>
                      <span className="text-[10px] tabular-nums text-white/80">
                        영향 {factor.value.toFixed(1)}
                      </span>
                    </div>
                  ))}
                  {topFactors.length === 0 && (
                    <p className="text-[10px] text-white/70">
                      검사를 완료하면 주요 요인이 여기 표시됩니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/simulator?tab=body')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-medium text-white/90 ring-1 ring-white/35 backdrop-blur-md active:scale-[0.98]"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>내 몸상태 자세히 보기</span>
            </button>
          </div>
        </div>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Home;