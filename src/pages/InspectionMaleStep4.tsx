import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { syncMaleInspectionStep } from '../lib/testsSessionSync';
import type { BingeStatus } from '../store/useSimulatorStore';
import { inspectionInputClassName as inputClassName } from '../lib/inspectionFormStyles';
import { useSimulatorStore } from '../store/useSimulatorStore';

function sanitizeSleepInput(s: string): string {
  let t = s.replace(/[^\d.]/g, '');
  const firstDot = t.indexOf('.');
  if (firstDot !== -1) {
    t = t.slice(0, firstDot + 1) + t.slice(firstDot + 1).replace(/\./g, '');
  }
  return t.slice(0, 6);
}

function parseSleepHours(s: string): number | null {
  const t = s.trim().replace(',', '.');
  if (t === '' || t === '.') return null;
  const n = parseFloat(t);
  if (!Number.isFinite(n) || n < 0 || n > 24) return null;
  return Math.round(n * 100) / 100;
}

/** 남성 검사 설문 Step 4/7 */
const InspectionMaleStep4 = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/inspection/male/3');
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionMaleStep4 = useSimulatorStore((s) => s.applyInspectionMaleStep4);

  const [bingeStatus, setBingeStatus] = useState<BingeStatus | null>(null);
  const [sleepStr, setSleepStr] = useState('');
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'male') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const s = useSimulatorStore.getState();
    setBingeStatus(s.bingeStatus);
    if (s.sleepHours > 0) setSleepStr(String(s.sleepHours));
    setSleepQuality(s.sleepQuality);
  }, []);

  const validation = useMemo(() => {
    const sleepHours = parseSleepHours(sleepStr);
    return {
      bingeOk: bingeStatus !== null,
      sleepOk: sleepHours !== null,
      sleepHours,
      isValid: bingeStatus !== null && sleepHours !== null,
    };
  }, [bingeStatus, sleepStr]);

  const showBingeError = touched && !validation.bingeOk;
  const showSleepError = touched && sleepStr.trim() !== '' && !validation.sleepOk;

  const onNext = useCallback(() => {
    setTouched(true);
    if (!validation.isValid || validation.sleepHours == null || bingeStatus == null) return;
    applyInspectionMaleStep4({
      bingeStatus,
      sleepHours: validation.sleepHours,
      sleepQuality,
    });
    void syncMaleInspectionStep(4);
    navigate('/inspection/interim-report');
  }, [applyInspectionMaleStep4, bingeStatus, navigate, sleepQuality, validation]);

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
            onClick={goBack}
            className="flex min-w-0 items-center gap-0.5 type-inspect-back active:opacity-80"
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

        <div className="relative z-10 shrink-0 px-5 pb-3 pt-1 sm:px-6">
          <h1 className="type-inspect-title">
            간단한 질문 몇 가지로
            <br />
            현재 몸 상태를 진단해볼게요!
          </h1>
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 sm:px-6">
          <div className="premium-scroll min-h-0 flex-1">
            <div className="mx-auto w-full max-w-[350px] rounded-[22px] bg-white/95 p-5 shadow-[0_16px_48px_rgba(24,24,48,0.12)] ring-1 ring-white/70 backdrop-blur-sm sm:rounded-[24px] sm:p-6">
              <div className="space-y-6">
                <div>
                  <p className="type-form-label mb-3">
                    10. 한 번에 5잔 이상 마신 날은 얼마나 되나요?
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { value: 'none', label: '없음' },
                      { value: 'monthly1', label: '월 1회' },
                      { value: 'weeklyOrMore', label: '주 1회 이상' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBingeStatus(opt.value as BingeStatus)}
                        className={`w-full rounded-[12px] border px-3 py-3 text-left text-[14px] font-semibold transition ${
                          bingeStatus === opt.value
                            ? 'border-[#9388FA] bg-[#9388FA] text-white shadow-[0_8px_20px_rgba(147,136,250,0.25)]'
                            : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {showBingeError && (
                    <p className="mt-2 text-[12px] text-red-600">폭음 빈도를 하나 선택해 주세요.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inspection-male-sleep" className="type-form-label mb-2 block">
                    11. 평균 수면 시간을 입력해주세요
                  </label>
                  <input
                    id="inspection-male-sleep"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="예: 6 (시간)"
                    value={sleepStr}
                    onChange={(e) => setSleepStr(sanitizeSleepInput(e.target.value))}
                    className={inputClassName}
                    aria-invalid={showSleepError}
                  />
                  {showSleepError && (
                    <p className="type-form-error mt-1.5">0~24 사이 시간을 입력해 주세요.</p>
                  )}
                </div>

                <div>
                  <p className="type-form-label mb-3">
                    수면의 질은 어떠셨나요? (선택)
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSleepQuality(v)}
                        className={`rounded-[10px] border py-2.5 text-[14px] font-semibold transition ${
                          sleepQuality === v
                            ? 'border-[#9388FA] bg-[#9388FA] text-white'
                            : 'border-[#D6D6DE] bg-white text-[#3a3a42]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="type-inspect-progress mb-3 text-center">4 / 7</p>
            <button
              type="button"
              disabled={!validation.isValid}
              onClick={onNext}
              className="w-full rounded-[16px] py-4 type-inspect-cta text-white/95 shadow-[0_10px_28px_rgba(32,24,64,0.2)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-white/70 disabled:shadow-none enabled:bg-[#9388FA] enabled:active:opacity-95"
            >
              다음으로
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionMaleStep4;
