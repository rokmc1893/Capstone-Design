import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { useSimulatorStore } from '../store/useSimulatorStore';

const inputClassName =
  'w-full rounded-[14px] border border-black/10 bg-[#F4F4F6] px-4 py-3.5 text-[16px] leading-[1.35] text-[#1a1a1f] shadow-inner shadow-black/[0.03] outline-none transition ' +
  'placeholder:text-[#A8A8AE] ' +
  'focus:border-[#9388FA] focus:bg-white focus:ring-2 focus:ring-[#9388FA]/35';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

function parseNonNegInt(s: string): number | null {
  const d = digitsOnly(s);
  if (d === '') return null;
  const n = parseInt(d, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

/** 남성 검사 설문 Step 2/7 */
const InspectionMaleStep2 = () => {
  const navigate = useNavigate();
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionMaleStep2 = useSimulatorStore((s) => s.applyInspectionMaleStep2);

  const [numBioKidStr, setNumBioKidStr] = useState('');
  const [sexFreqStr, setSexFreqStr] = useState('');
  const [hasSex12Mo, setHasSex12Mo] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'male') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const s = useSimulatorStore.getState();
    setNumBioKidStr(String(s.numBioKid));
    setSexFreqStr(String(s.sexFreq));
    setHasSex12Mo(s.hasSex12Mo);
  }, []);

  const validation = useMemo(() => {
    const numBioKid = parseNonNegInt(numBioKidStr);
    const numBioKidOk = numBioKid !== null && numBioKid <= 30;

    const sexFreq = parseNonNegInt(sexFreqStr);
    const sexFreqOk = sexFreq !== null && sexFreq <= 300;

    const hasSex12MoOk = hasSex12Mo !== null;

    return {
      numBioKidOk,
      sexFreqOk,
      hasSex12MoOk,
      numBioKid: numBioKidOk ? numBioKid! : null,
      sexFreq: sexFreqOk ? sexFreq! : null,
      isValid: numBioKidOk && sexFreqOk && hasSex12MoOk,
    };
  }, [numBioKidStr, sexFreqStr, hasSex12Mo]);

  const showNumBioKidError = touched && numBioKidStr.trim() !== '' && !validation.numBioKidOk;
  const showSexFreqError = touched && sexFreqStr.trim() !== '' && !validation.sexFreqOk;
  const showHasSexError = touched && !validation.hasSex12MoOk;

  const onNext = useCallback(() => {
    setTouched(true);
    if (
      !validation.isValid ||
      validation.numBioKid == null ||
      validation.sexFreq == null ||
      hasSex12Mo == null
    )
      return;
    applyInspectionMaleStep2({
      numBioKid: validation.numBioKid,
      sexFreq: validation.sexFreq,
      hasSex12Mo,
    });
    navigate('/inspection/male/3');
  }, [applyInspectionMaleStep2, hasSex12Mo, navigate, validation]);

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
            onClick={() => navigate('/inspection/male/1')}
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

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 pt-1 sm:px-6">
          <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
            <div className="mx-auto w-full max-w-[350px] rounded-[22px] bg-white/95 p-5 shadow-[0_16px_48px_rgba(24,24,48,0.12)] ring-1 ring-white/70 backdrop-blur-sm sm:rounded-[24px] sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="inspection-male-kids" className="mb-2 block text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    4. 생물학적 자녀가 몇 명 있으신가요?
                  </label>
                  <input
                    id="inspection-male-kids"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0 이상의 숫자를 입력해주세요"
                    value={numBioKidStr}
                    onChange={(e) => setNumBioKidStr(digitsOnly(e.target.value).slice(0, 2))}
                    className={inputClassName}
                    aria-invalid={showNumBioKidError}
                  />
                  {showNumBioKidError && (
                    <p className="mt-1.5 text-[12px] text-red-600">0 이상의 숫자를 입력해 주세요.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inspection-male-sexfreq" className="mb-2 block text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    5. 최근 4주간 성관계 횟수가 대략 어떻게 되시나요?
                  </label>
                  <input
                    id="inspection-male-sexfreq"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0 이상의 숫자를 입력해주세요"
                    value={sexFreqStr}
                    onChange={(e) => setSexFreqStr(digitsOnly(e.target.value).slice(0, 3))}
                    className={inputClassName}
                    aria-invalid={showSexFreqError}
                  />
                  {showSexFreqError && (
                    <p className="mt-1.5 text-[12px] text-red-600">0 이상의 숫자를 입력해 주세요.</p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    6. 최근 1년(12개월) 내에 성관계를 가진 적이 있나요?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setHasSex12Mo(true)}
                      className={`rounded-[12px] border px-3 py-3 text-[15px] font-semibold transition ${
                        hasSex12Mo === true
                          ? 'border-[#9388FA] bg-[#9388FA] text-white shadow-[0_8px_20px_rgba(147,136,250,0.25)]'
                          : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
                      }`}
                    >
                      네
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSex12Mo(false)}
                      className={`rounded-[12px] border px-3 py-3 text-[15px] font-semibold transition ${
                        hasSex12Mo === false
                          ? 'border-[#9388FA] bg-[#9388FA] text-white shadow-[0_8px_20px_rgba(147,136,250,0.25)]'
                          : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
                      }`}
                    >
                      아니요
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#6b6b76]">
                    &lsquo;아니요&rsquo; 선택 시 서버에서 특수 값(5)으로 처리됩니다.
                  </p>
                  {showHasSexError && (
                    <p className="mt-1.5 text-[12px] text-red-600">네/아니요 중 하나를 선택해 주세요.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="mb-3 text-center text-[14px] font-medium text-white/95">2 / 7</p>
            <button
              type="button"
              disabled={!validation.isValid}
              onClick={onNext}
              className="w-full rounded-[16px] py-4 text-[17px] font-bold tracking-[-0.2px] text-white shadow-[0_10px_28px_rgba(32,24,64,0.2)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/35 disabled:text-white/70 disabled:shadow-none enabled:bg-[#9388FA] enabled:active:opacity-95"
            >
              다음으로
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionMaleStep2;
