import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { syncFemaleInspectionStep } from '../lib/testsSessionSync';
import { inspectionInputClassName as inputClassName } from '../lib/inspectionFormStyles';
import { useSimulatorStore } from '../store/useSimulatorStore';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

function parsePositiveNumber(s: string): number | null {
  const t = s.trim().replace(',', '.');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * 여성 건강 검사 설문 Step 1/6 (검사하기 → 여자 선택 후)
 */
const InspectionFemaleStep1 = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/home');
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionStep1 = useSimulatorStore((s) => s.applyInspectionStep1);

  const [ageStr, setAgeStr] = useState('');
  const [heightStr, setHeightStr] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'female') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const s = useSimulatorStore.getState();
    if (s.heightCm > 0 || s.weightKg > 0) {
      if (s.age >= 15 && s.age <= 44) setAgeStr(String(s.age));
      if (s.heightCm > 0) setHeightStr(String(s.heightCm));
      if (s.weightKg > 0) setWeightStr(String(s.weightKg));
    }
  }, []);

  const validation = useMemo(() => {
    const ageDigits = digitsOnly(ageStr);
    const ageNum = ageDigits === '' ? null : parseInt(ageDigits, 10);
    const ageOk = ageNum !== null && !Number.isNaN(ageNum) && ageNum >= 15 && ageNum <= 44;

    const h = parsePositiveNumber(heightStr);
    const heightOk = h !== null && h >= 120 && h <= 220;

    const w = parsePositiveNumber(weightStr);
    const weightOk = w !== null && w >= 25 && w <= 250;

    return {
      ageOk,
      heightOk,
      weightOk,
      ageNum: ageOk ? ageNum! : null,
      heightCm: heightOk ? h! : null,
      weightKg: weightOk ? w! : null,
      isValid: ageOk && heightOk && weightOk,
    };
  }, [ageStr, heightStr, weightStr]);

  const showAgeError = touched && ageStr.trim() !== '' && !validation.ageOk;
  const showHeightError = touched && heightStr.trim() !== '' && !validation.heightOk;
  const showWeightError = touched && weightStr.trim() !== '' && !validation.weightOk;

  const onNext = useCallback(() => {
    setTouched(true);
    if (!validation.isValid || !validation.ageNum || validation.heightCm == null || validation.weightKg == null) return;
    applyInspectionStep1({
      age: validation.ageNum,
      heightCm: validation.heightCm,
      weightKg: validation.weightKg,
    });
    void syncFemaleInspectionStep(1);
    navigate('/inspection/female/2');
  }, [applyInspectionStep1, navigate, validation]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-3 sm:p-4">
      <div
        className="relative flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] shadow-xl sm:h-[844px]"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute bottom-[-60px] left-1/2 h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-[#9388FA]/20 blur-[32px]" />
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

        <main className="premium-scroll relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-6 pt-2 sm:px-6">
          <h1 className="type-inspect-title">
            간단한 질문 몇 가지로
            <br />
            현재 몸 상태를 진단해볼게요!
          </h1>

          <div className="mx-auto mt-6 w-full max-w-[350px] flex-1 rounded-[22px] bg-white/95 p-5 shadow-[0_16px_48px_rgba(24,24,48,0.12)] ring-1 ring-white/70 backdrop-blur-sm sm:mt-7 sm:rounded-[24px] sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="inspection-age" className="type-form-label mb-2 block">
                  1. 현재 만 나이가 어떻게 되시나요?
                </label>
                <input
                  id="inspection-age"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="15~44 사이의 숫자를 입력해주세요"
                  value={ageStr}
                  onChange={(e) => setAgeStr(digitsOnly(e.target.value).slice(0, 2))}
                  className={inputClassName}
                  aria-invalid={showAgeError}
                />
                {showAgeError && (
                  <p className="type-form-error mt-1.5">15~44 사이의 숫자만 입력할 수 있어요.</p>
                )}
              </div>

              <div>
                <label htmlFor="inspection-height" className="type-form-label mb-2 block">
                  2. 키를 알려주세요 (cm)
                </label>
                <input
                  id="inspection-height"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="예: 160"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value.replace(/[^\d.]/g, ''))}
                  className={inputClassName}
                  aria-invalid={showHeightError}
                />
                {showHeightError && (
                  <p className="type-form-error mt-1.5">120~220cm 사이로 입력해 주세요.</p>
                )}
              </div>

              <div>
                <label htmlFor="inspection-weight" className="type-form-label mb-2 block">
                  3. 몸무게를 알려 주세요 (kg)
                </label>
                <input
                  id="inspection-weight"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="예: 55"
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value.replace(/[^\d.]/g, ''))}
                  className={inputClassName}
                  aria-invalid={showWeightError}
                />
                {showWeightError && (
                  <p className="type-form-error mt-1.5">25~250kg 사이로 입력해 주세요.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 w-full max-w-[350px] shrink-0 sm:mt-7">
            <p className="type-inspect-progress mb-3 text-center">1 / 6</p>
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

export default InspectionFemaleStep1;
