import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ClipboardList, Heart } from 'lucide-react';
import { BottomTabNav } from '../components/BottomTabNav';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { fetchLatestResultReportForHome, getRiskLevelLabel } from '../lib/resultReport';
import type { ResultReport } from '../types/resultReport';

const Home = () => {
  const navigate = useNavigate();
  const userName = useUserProfileStore((s) => s.name);
  const risk = useSimulatorStore((s) => s.risk);
  const heightCm = useSimulatorStore((s) => s.heightCm);
  const weightKg = useSimulatorStore((s) => s.weightKg);
  const age = useSimulatorStore((s) => s.age);
  const bmi = useSimulatorStore((s) => s.bmi);
  const sleepHours = useSimulatorStore((s) => s.sleepHours);
  const smoking = useSimulatorStore((s) => s.smoking);
  const alcohol = useSimulatorStore((s) => s.alcohol);
  const stressLevel = useSimulatorStore((s) => s.stressLevel);

  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);
  const [latestReport, setLatestReport] = useState<ResultReport | null | undefined>(undefined);

  useEffect(() => {
    if (!hasApiBase) {
      setLatestReport(null);
      return;
    }
    let mounted = true;
    void fetchLatestResultReportForHome().then((r) => {
      if (mounted) setLatestReport(r ?? null);
    });
    return () => {
      mounted = false;
    };
  }, [hasApiBase]);

  const hasInspectionResult = heightCm > 0 && weightKg > 0;

  const riskFactors = useMemo(() => {
    const factors: { label: string; value: number }[] = [];

    if (age >= 40) factors.push({ label: '나이', value: 25 });
    else if (age >= 35) factors.push({ label: '나이', value: 15 });

    if (bmi >= 25) factors.push({ label: 'BMI', value: 15 });
    else if (bmi >= 23) factors.push({ label: 'BMI', value: 10 });

    if (sleepHours < 6) factors.push({ label: '수면', value: 15 });
    else if (sleepHours < 7) factors.push({ label: '수면', value: 8 });

    if (smoking === 'often') factors.push({ label: '흡연', value: 18 });
    else if (smoking === 'sometimes') factors.push({ label: '흡연', value: 10 });

    if (alcohol === 'often') factors.push({ label: '음주', value: 12 });
    else if (alcohol === 'sometimes') factors.push({ label: '음주', value: 6 });

    if (stressLevel > 0) {
      factors.push({ label: '스트레스', value: stressLevel * 2 });
    }

    return factors.sort((a, b) => b.value - a.value);
  }, [age, alcohol, bmi, sleepHours, smoking, stressLevel]);

  const serverFactors = useMemo(() => {
    if (!latestReport) return null;
    if (latestReport.topFactors?.length) return latestReport.topFactors;
    if (latestReport.factorAnalyses?.length) {
      return latestReport.factorAnalyses.map((f) => ({ label: f.factor, value: 0 }));
    }
    if (latestReport.coreRiskBullets?.length) {
      return latestReport.coreRiskBullets.slice(0, 6).map((t) => ({
        label: t.length > 28 ? `${t.slice(0, 28)}…` : t,
        value: 0,
      }));
    }
    return null;
  }, [latestReport]);

  const cardClassName =
    'flex min-h-[132px] min-w-0 flex-col rounded-[20px] bg-white/12 px-3.5 py-3.5 shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl';

  const showServerCards = hasApiBase && latestReport !== undefined && latestReport !== null;
  const showServerEmpty = hasApiBase && latestReport === null;
  const serverLoading = hasApiBase && latestReport === undefined;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pt-12">
          <div className="flex items-start justify-between">
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

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/inspection')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div className="min-w-0 pr-3">
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사하기
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  현재 상태를 간편하게 체크합니다
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <ClipboardList className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/inspection-reports/archive')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div className="min-w-0 pr-3">
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사 상세 리포트
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  최근 점수와 주요 요인을 한눈에
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <Heart className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 pb-[104px] pt-6">
            <div className={cardClassName}>
              <p className="text-[12px] font-semibold leading-[18px] text-white/90">최근 검사 결과</p>
              {serverLoading ? (
                <p className="mt-auto text-[13px] text-white/70">불러오는 중…</p>
              ) : showServerCards ? (
                <div className="mt-3 flex flex-1 flex-col justify-end">
                  <p className="break-keep text-[24px] font-bold leading-[30px] tabular-nums tracking-[-0.3px] text-white">
                    {latestReport.score}점
                  </p>
                  <p className="mt-2 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium leading-[16px] text-white/90">
                    {getRiskLevelLabel(latestReport.riskLevel)}
                  </p>
                </div>
              ) : showServerEmpty ? (
                <p className="mt-auto text-[22px] font-semibold leading-[28px] text-white/75">---</p>
              ) : hasInspectionResult ? (
                <div className="mt-3 flex flex-1 flex-col justify-end">
                  <p className="break-keep text-[24px] font-bold leading-[30px] tabular-nums tracking-[-0.3px] text-white">
                    {risk.toFixed(0)}점
                  </p>
                  <p className="mt-2 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium leading-[16px] text-white/90">
                    {risk < 30 ? '양호' : risk < 60 ? '주의' : '고위험'}
                  </p>
                </div>
              ) : (
                <p className="mt-auto text-[22px] font-semibold leading-[28px] text-white/75">---</p>
              )}
            </div>

            <div className={cardClassName}>
              <p className="text-[12px] font-semibold leading-[18px] text-white/90">주요 요인</p>
              {serverLoading ? (
                <p className="mt-auto text-[13px] text-white/70">불러오는 중…</p>
              ) : showServerCards ? (
                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                  {serverFactors && serverFactors.length > 0 ? (
                    serverFactors.map((factor) => (
                      <span
                        key={`${factor.label}-${factor.value}`}
                        className="inline-flex max-w-full items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium leading-[14px] text-white/90 ring-1 ring-white/25"
                      >
                        <span className="break-keep">{factor.label}</span>
                      </span>
                    ))
                  ) : (
                    <p className="text-[11px] leading-relaxed text-white/70">표시할 주요 요인이 없습니다.</p>
                  )}
                </div>
              ) : showServerEmpty ? (
                <p className="mt-auto text-[22px] font-semibold leading-[28px] text-white/75">---</p>
              ) : hasInspectionResult && riskFactors.length > 0 ? (
                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                  {riskFactors.map((factor) => (
                    <span
                      key={factor.label}
                      className="inline-flex max-w-full items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium leading-[14px] text-white/90 ring-1 ring-white/25"
                    >
                      <span className="break-keep">{factor.label}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-auto text-[22px] font-semibold leading-[28px] text-white/75">---</p>
              )}
            </div>
          </div>
        </div>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Home;
