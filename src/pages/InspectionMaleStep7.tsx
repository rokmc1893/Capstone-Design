import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { useRestoreInspectionSession } from '../hooks/useRestoreInspectionSession';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import type { PssScore } from '../store/useSimulatorStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { navigateAfterTestSubmit } from '../lib/inspectionReportNav';
import { postTestSubmitFromStore } from '../lib/testsSessionApi';
import { useTestSessionStore } from '../store/useTestSessionStore';

const SCALE_ITEMS: Array<{ value: PssScore; label: string }> = [
  { value: 0, label: '전혀 없었다' },
  { value: 1, label: '거의 없었다' },
  { value: 2, label: '때때로 있었다' },
  { value: 3, label: '자주 있었다' },
  { value: 4, label: '매우 자주 있었다' },
];

function ScaleRow({
  value,
  onChange,
}: {
  value: PssScore | null;
  onChange: (v: PssScore) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {SCALE_ITEMS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`rounded-[10px] border py-2 text-[14px] font-semibold transition ${
              value === item.value
                ? 'border-[#9388FA] bg-[#9388FA] text-white'
                : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
            }`}
          >
            {item.value}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 text-center">
        {SCALE_ITEMS.map((item) => (
          <span key={item.value} className="text-[10px] leading-tight text-[#6B6B76]">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 남성 검사 설문 Step 7/7 (PSS 7~10) */
const InspectionMaleStep7 = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/inspection/male/6');
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionMaleStep7 = useSimulatorStore((s) => s.applyInspectionMaleStep7);
  const restoreReady = useRestoreInspectionSession('male');

  const [q7, setQ7] = useState<PssScore | null>(null);
  const [q8, setQ8] = useState<PssScore | null>(null);
  const [q9, setQ9] = useState<PssScore | null>(null);
  const [q10, setQ10] = useState<PssScore | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'male') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  useEffect(() => {
    if (!restoreReady) return;
    const s = useSimulatorStore.getState();
    setQ7(s.pssAnswers[6]);
    setQ8(s.pssAnswers[7]);
    setQ9(s.pssAnswers[8]);
    setQ10(s.pssAnswers[9]);
  }, [restoreReady]);

  const isValid = useMemo(
    () => q7 !== null && q8 !== null && q9 !== null && q10 !== null,
    [q7, q8, q9, q10],
  );

  const onResult = useCallback(async () => {
    setTouched(true);
    if (q7 === null || q8 === null || q9 === null || q10 === null) return;
    applyInspectionMaleStep7({ q7, q8, q9, q10 });

    const sessionId = useTestSessionStore.getState().sessionId;
    const base = import.meta.env.VITE_API_BASE_URL;
    if (base && sessionId) {
      try {
        const submitResult = await postTestSubmitFromStore(
          sessionId,
          useSimulatorStore.getState().pssAnswers,
        );
        const gender = useSimulatorStore.getState().gender;
        useTestSessionStore.getState().clearSession();
        useSimulatorStore.getState().resetInspectionDraft(gender);
        navigateAfterTestSubmit(navigate, submitResult);
        return;
      } catch {
        /* 세션 유지 후 보관함에서 재시도 가능 */
      }
    }
    navigate('/inspection-reports/archive');
  }, [applyInspectionMaleStep7, navigate, q7, q8, q9, q10]);

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
                    7. 일상생활의 짜증을 얼마나 자주 잘 다스릴 수 있었습니까?
                  </p>
                  <ScaleRow value={q7} onChange={setQ7} />
                </div>
                <div>
                  <p className="type-form-label mb-3">
                    8. 최상의 컨디션이라고 얼마나 자주 느끼셨습니까?
                  </p>
                  <ScaleRow value={q8} onChange={setQ8} />
                </div>
                <div>
                  <p className="type-form-label mb-3">
                    9. 당신이 통제할 수 없는 일 때문에 화가 난 경험이 얼마나 있었습니까?
                  </p>
                  <ScaleRow value={q9} onChange={setQ9} />
                </div>
                <div>
                  <p className="type-form-label mb-3">
                    10. 어려운 일이 너무 많아서 극복하지 못할 것 같은 느낌을 얼마나 자주 경험하셨습니까?
                  </p>
                  <ScaleRow value={q10} onChange={setQ10} />
                </div>
              </div>

              {touched && !isValid && (
                <p className="mt-4 text-[12px] text-red-600">모든 문항에 응답해 주세요.</p>
              )}
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="type-inspect-progress mb-3 text-center">7 / 7</p>
            <button
              type="button"
              disabled={!isValid}
              onClick={onResult}
              className="w-full rounded-[18px] py-4 type-inspect-cta-final text-white/95/70 disabled:shadow-none enabled:bg-[#7E6AF2] enabled:active:opacity-95"
            >
              결과 확인
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionMaleStep7;
