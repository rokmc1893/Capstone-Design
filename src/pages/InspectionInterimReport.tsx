import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Moon, Scale, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ApiError } from '../lib/api';
import {
  buildMockInterimReport,
  fetchInterimReport,
  formatBmiDeltaPct,
  formatSleepDeltaHours,
  obesityStageLabel,
} from '../lib/interimReport';
import { useTestSessionStore } from '../store/useTestSessionStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import type { InterimReportDto } from '../types/interimReport';

const InspectionInterimReport = () => {
  const navigate = useNavigate();
  const gender = useSimulatorStore((s) => s.gender);
  const sessionId = useTestSessionStore((s) => s.sessionId);
  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);

  const [report, setReport] = useState<InterimReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paths = useMemo(() => {
    if (gender === 'female') {
      return {
        back: '/inspection/female/3',
        next: '/inspection/female/4',
        nextLabel: '스트레스 설문 계속하기',
        stepHint: '중간 결과 · PSS 설문 전',
        subtitle: '또래 평균과 비교한 참고 정보입니다. 이어서 스트레스 설문을 진행해 주세요.',
      };
    }
    return {
      back: '/inspection/male/4',
      next: '/inspection/male/5',
      nextLabel: '스트레스 설문 계속하기',
      stepHint: '중간 결과 · PSS 설문 전',
      subtitle: '또래 평균과 비교한 참고 정보입니다. 이어서 스트레스 설문을 진행해 주세요.',
    };
  }, [gender]);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasApiBase && sessionId) {
        const data = await fetchInterimReport(sessionId);
        setReport(data);
      } else {
        setReport(buildMockInterimReport(useSimulatorStore.getState()));
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : '중간 보고서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
      setError(msg);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [hasApiBase, sessionId]);

  useEffect(() => {
    if (gender !== 'male' && gender !== 'female') {
      navigate('/inspection', { replace: true });
      return;
    }
    void loadReport();
  }, [gender, loadReport, navigate]);

  const sleepLine = report?.sleepCalculated
    ? formatSleepDeltaHours(report.sleepDeltaHours)
    : null;
  const bmiLine = report?.obesityCalculated
    ? formatBmiDeltaPct(report.bmiDeltaVsAgeSexMeanPct)
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-3 sm:p-4">
      <div
        className="relative flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] shadow-xl sm:h-[844px]"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 shrink-0 pt-1.5">
          <StatusBar />
        </header>

        <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pb-2 pt-1 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(paths.back)}
            className="flex min-w-0 items-center gap-0.5 text-[16px] font-bold leading-6 tracking-[-0.2px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] active:opacity-80"
          >
            <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="truncate">검사하기</span>
          </button>
          <button
            type="button"
            aria-label="설정"
            onClick={() => navigate('/settings')}
            className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/50 backdrop-blur-md active:scale-[0.98]"
          >
            <Settings className="h-5 w-5 text-[#1a1a1f]" strokeWidth={1.85} />
          </button>
        </div>

        <div className="relative z-10 shrink-0 px-5 pb-2 pt-1 sm:px-6">
          <p className="text-center text-[13px] font-semibold text-white/85">{paths.stepHint}</p>
          <h1 className="mt-2 text-center text-[22px] font-bold leading-[1.35] tracking-[-0.35px] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
            지금까지 입력하신 내용을
            <br />
            바탕으로 본 중간 결과예요
          </h1>
          <p className="mt-2 text-center text-[12px] leading-relaxed text-white/80">{paths.subtitle}</p>
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 sm:px-6">
          <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
            {loading ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-white/90">
                <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
                <p className="text-[14px] font-medium">중간 결과를 분석하고 있어요…</p>
              </div>
            ) : error ? (
              <div className="mx-auto w-full max-w-[350px] rounded-[22px] bg-white/95 p-6 text-center shadow-lg ring-1 ring-white/70">
                <p className="text-[14px] leading-relaxed text-[#3a3a42]">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadReport()}
                  className="mt-4 rounded-[12px] bg-[#9388FA] px-5 py-2.5 text-[14px] font-semibold text-white"
                >
                  다시 시도
                </button>
              </div>
            ) : report ? (
              <div className="mx-auto w-full max-w-[350px] space-y-4">
                {report.sleepCalculated ? (
                  <section className="rounded-[20px] bg-white/95 p-5 shadow-[0_12px_32px_rgba(24,24,48,0.1)] ring-1 ring-white/70">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Moon className="h-5 w-5" aria-hidden />
                      </span>
                      <h2 className="text-[16px] font-bold text-[#2a2a32]">수면</h2>
                    </div>
                    {report.sleepAgeBand ? (
                      <p className="text-[12px] text-[#6B6B76]">비교 기준: {report.sleepAgeBand} 평균</p>
                    ) : null}
                    {report.sleepAvgHours != null ? (
                      <p className="mt-2 text-[13px] text-[#3a3a42]">
                        또래 평균 수면{' '}
                        <span className="font-semibold tabular-nums">{report.sleepAvgHours}시간</span>
                      </p>
                    ) : null}
                    {sleepLine ? (
                      <p className="mt-3 text-[15px] font-semibold leading-snug text-[#9388FA]">{sleepLine}</p>
                    ) : (
                      <p className="mt-3 text-[14px] text-[#6B6B76]">수면 비교 데이터를 계산했어요.</p>
                    )}
                  </section>
                ) : (
                  <section className="rounded-[20px] bg-white/95 p-5 text-[14px] text-[#6B6B76] ring-1 ring-white/70">
                    수면 시간·분을 모두 입력하면 또래 평균과 비교할 수 있어요.
                  </section>
                )}

                {report.obesityCalculated ? (
                  <section className="rounded-[20px] bg-white/95 p-5 shadow-[0_12px_32px_rgba(24,24,48,0.1)] ring-1 ring-white/70">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                        <Scale className="h-5 w-5" aria-hidden />
                      </span>
                      <h2 className="text-[16px] font-bold text-[#2a2a32]">BMI · 체중</h2>
                    </div>
                    {report.bmi != null ? (
                      <p className="text-[13px] text-[#3a3a42]">
                        나의 BMI{' '}
                        <span className="text-[18px] font-bold tabular-nums text-[#2a2a32]">
                          {report.bmi.toFixed(1)}
                        </span>
                      </p>
                    ) : null}
                    <p className="mt-2 inline-flex rounded-full bg-[#9388FA]/10 px-2.5 py-1 text-[12px] font-semibold text-[#9388FA]">
                      {obesityStageLabel(report.obesityStage)}
                    </p>
                    {report.obesityPrevalencePct != null && report.obesityStage !== 'NONE' ? (
                      <p className="mt-2 text-[12px] text-[#6B6B76]">
                        해당 단계 유병률 약 {report.obesityPrevalencePct.toFixed(1)}%
                      </p>
                    ) : null}
                    {report.ageSexMeanBmi != null ? (
                      <p className="mt-2 text-[12px] text-[#6B6B76]">
                        또래 평균 BMI {report.ageSexMeanBmi.toFixed(1)}
                      </p>
                    ) : null}
                    {bmiLine ? (
                      <p className="mt-3 text-[15px] font-semibold leading-snug text-[#9388FA]">{bmiLine}</p>
                    ) : null}
                  </section>
                ) : null}

                {!report.sleepCalculated && !report.obesityCalculated ? (
                  <section className="rounded-[20px] bg-white/95 p-5 text-center text-[14px] leading-relaxed text-[#6B6B76] ring-1 ring-white/70">
                    아직 비교할 수 있는 항목이 없어요. 이전 단계에서 키·몸무게·수면 정보를 입력해 주세요.
                  </section>
                ) : null}

                <p className="px-1 text-[11px] leading-relaxed text-white/75">
                  본 결과는 의학적 진단이 아니며, 참고용 안내입니다. 정확한 판단은 전문의 상담이 필요해요.
                </p>
              </div>
            ) : null}
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1">
            <button
              type="button"
              disabled={loading || Boolean(error)}
              onClick={() => navigate(paths.next)}
              className="w-full rounded-[16px] py-4 text-[17px] font-bold tracking-[-0.2px] text-white shadow-[0_10px_28px_rgba(32,24,64,0.2)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-white/70 disabled:shadow-none enabled:bg-[#9388FA] enabled:active:opacity-95"
            >
              {paths.nextLabel}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionInterimReport;
