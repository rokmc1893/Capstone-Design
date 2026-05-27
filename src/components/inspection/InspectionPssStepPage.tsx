import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../../hooks/useGoBack';
import { useRestoreInspectionSession } from '../../hooks/useRestoreInspectionSession';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../StatusBar';
import { PssScaleRow } from './PssScaleRow';
import type { PssScore } from '../../store/useSimulatorStore';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export type PssQuestionDef = {
  /** PSS 문항 번호 (1~10) */
  number: number;
  /** `pssAnswers` 배열 인덱스 (0~9) */
  index: number;
  text: string;
};

export type InspectionPssStepPageProps = {
  expectedGender: 'male' | 'female';
  progressText: string;
  backPath: string;
  questions: PssQuestionDef[];
  showIntro?: boolean;
  mode: 'next' | 'submit';
  nextPath?: string;
  onPersist: (scores: PssScore[]) => void;
  onSubmitResult?: () => void | Promise<void>;
};

export function InspectionPssStepPage({
  expectedGender,
  progressText,
  backPath,
  questions,
  showIntro = false,
  mode,
  nextPath,
  onPersist,
  onSubmitResult,
}: InspectionPssStepPageProps) {
  const navigate = useNavigate();
  const goBack = useGoBack(backPath);
  const gender = useSimulatorStore((s) => s.gender);
  const restoreReady = useRestoreInspectionSession(expectedGender);

  const [values, setValues] = useState<Array<PssScore | null>>(() =>
    questions.map(() => null),
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== expectedGender) navigate('/inspection', { replace: true });
  }, [expectedGender, gender, navigate]);

  useEffect(() => {
    if (!restoreReady) return;
    const answers = useSimulatorStore.getState().pssAnswers;
    setValues(questions.map((q) => answers[q.index] ?? null));
  }, [questions, restoreReady]);

  const isValid = useMemo(() => values.every((v) => v !== null), [values]);

  const setAt = (i: number, v: PssScore) => {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const onPrimary = useCallback(async () => {
    setTouched(true);
    if (!isValid) return;
    onPersist(values as PssScore[]);
    if (mode === 'next' && nextPath) {
      navigate(nextPath);
      return;
    }
    if (mode === 'submit' && onSubmitResult) {
      await onSubmitResult();
    }
  }, [isValid, mode, navigate, nextPath, onPersist, onSubmitResult, values]);

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
              {showIntro ? (
                <>
                  <p className="mb-4 text-[13px] leading-relaxed text-[#585863]">
                    다음 문항은 최근 1개월 동안 당신이 느끼고 생각한 것에 대한 것입니다.
                    각 문항에 해당하는 내용을 얼마나 자주 느꼈는지 평가해주십시오.
                  </p>
                  <div className="mb-5 rounded-[12px] bg-[#F6F5FB] p-3 text-[11px] leading-relaxed text-[#585863]">
                    0: 전혀 없었다 · 1: 거의 없었다 · 2: 때때로 있었다 · 3: 자주 있었다 · 4: 매우 자주 있었다
                  </div>
                </>
              ) : null}

              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={q.index}>
                    <p className="type-form-label mb-3">
                      {q.number}. {q.text}
                    </p>
                    <PssScaleRow value={values[i]} onChange={(v) => setAt(i, v)} />
                  </div>
                ))}
              </div>

              {touched && !isValid ? (
                <p className="mt-4 text-[12px] text-red-600">모든 문항에 응답해 주세요.</p>
              ) : null}
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="type-inspect-progress mb-3 text-center">{progressText}</p>
            <button
              type="button"
              disabled={!isValid}
              onClick={() => void onPrimary()}
              className={
                mode === 'submit'
                  ? 'w-full rounded-[18px] py-4 type-inspect-cta-final text-white/95/70 disabled:shadow-none enabled:bg-[#7E6AF2] enabled:active:opacity-95'
                  : 'w-full rounded-[16px] py-4 type-inspect-cta text-white/95 shadow-[0_10px_28px_rgba(32,24,64,0.2)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-white/70 disabled:shadow-none enabled:bg-[#9388FA] enabled:active:opacity-95'
              }
            >
              {mode === 'submit' ? '결과 확인' : '다음으로'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
