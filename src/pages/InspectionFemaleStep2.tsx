import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import type { FemaleConditions } from '../store/useSimulatorStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

const inputClassName =
  'w-full rounded-[14px] border border-black/10 bg-[#F4F4F6] px-4 py-3.5 text-[16px] leading-[1.35] text-[#1a1a1f] shadow-inner shadow-black/[0.03] outline-none transition ' +
  'placeholder:text-[#A8A8AE] ' +
  'focus:border-[#9388FA] focus:bg-white focus:ring-2 focus:ring-[#9388FA]/35';

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '');
}

const DISEASE_KEYS = ['pcos', 'endo', 'uf', 'pid', 'chlam', 'gon'] as const;
type DiseaseKey = (typeof DISEASE_KEYS)[number];

const DISEASE_LABELS: Record<DiseaseKey, string> = {
  pcos: '다낭성 난소 증후군 (PCOS)',
  endo: '자궁내막증',
  uf: '자궁근종',
  pid: '골반염',
  chlam: '클라미디아',
  gon: '임질',
};

const emptyConditions = (): FemaleConditions => ({
  pcos: false,
  endo: false,
  uf: false,
  pid: false,
  chlam: false,
  gon: false,
  none: false,
});

/**
 * 여성 건강 검사 설문 Step 2/6
 */
const InspectionFemaleStep2 = () => {
  const navigate = useNavigate();
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionStep2 = useSimulatorStore((s) => s.applyInspectionStep2);

  const [menarcheStr, setMenarcheStr] = useState('');
  const [parityStr, setParityStr] = useState('');
  const [conditions, setConditions] = useState<FemaleConditions>(emptyConditions);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'female') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const s = useSimulatorStore.getState();
    if (s.menarcheAge >= 8 && s.menarcheAge <= 18) {
      setMenarcheStr(String(s.menarcheAge));
      setParityStr(String(s.parity));
    }
    if (s.femaleConditions && Object.values(s.femaleConditions).some(Boolean)) {
      setConditions({ ...emptyConditions(), ...s.femaleConditions });
    }
  }, []);

  const validation = useMemo(() => {
    const md = digitsOnly(menarcheStr);
    const menarcheNum = md === '' ? null : parseInt(md, 10);
    const menarcheOk =
      menarcheNum !== null && !Number.isNaN(menarcheNum) && menarcheNum >= 8 && menarcheNum <= 18;

    const pd = digitsOnly(parityStr);
    const parityNum = pd === '' ? null : parseInt(pd, 10);
    const parityOk =
      parityNum !== null && !Number.isNaN(parityNum) && parityNum >= 0 && parityNum <= 30;

    const anyDisease = DISEASE_KEYS.some((k) => conditions[k]);
    const conditionsOk =
      (conditions.none && !anyDisease) || (!conditions.none && anyDisease);

    return {
      menarcheOk,
      parityOk,
      conditionsOk,
      menarcheNum: menarcheOk ? menarcheNum! : null,
      parityNum: parityOk ? parityNum! : null,
      isValid: menarcheOk && parityOk && conditionsOk,
    };
  }, [menarcheStr, parityStr, conditions]);

  const showMenarcheError = touched && menarcheStr.trim() !== '' && !validation.menarcheOk;
  const showParityError = touched && parityStr.trim() !== '' && !validation.parityOk;
  const showConditionsError = touched && !validation.conditionsOk;

  const diseaseDisabled = conditions.none;

  const toggleDisease = (key: DiseaseKey) => {
    if (conditions.none) return;
    setConditions((prev) => ({
      ...prev,
      none: false,
      [key]: !prev[key],
    }));
  };

  const toggleNone = () => {
    setConditions((prev) => {
      if (prev.none) return { ...emptyConditions() };
      return { ...emptyConditions(), none: true };
    });
  };

  const onNext = useCallback(() => {
    setTouched(true);
    if (
      !validation.isValid ||
      validation.menarcheNum == null ||
      validation.parityNum == null
    )
      return;
    applyInspectionStep2({
      menarcheAge: validation.menarcheNum,
      parity: validation.parityNum,
      femaleConditions: { ...conditions },
    });
    navigate('/inspection/female/3');
  }, [applyInspectionStep2, conditions, navigate, validation]);

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
            onClick={() => navigate('/home')}
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
                  <label htmlFor="inspection-menarche" className="mb-2 block text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    4. 초경을 시작한 나이는 언제인가요?
                  </label>
                  <input
                    id="inspection-menarche"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="8~18 사이의 숫자를 입력해주세요"
                    value={menarcheStr}
                    onChange={(e) => setMenarcheStr(digitsOnly(e.target.value).slice(0, 2))}
                    className={inputClassName}
                    aria-invalid={showMenarcheError}
                  />
                  {showMenarcheError && (
                    <p className="mt-1.5 text-[12px] text-red-600">8~18 사이로 입력해 주세요.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="inspection-parity" className="mb-2 block text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    5. 과거 임신/출산 경험(횟수)이 있으신가요?
                  </label>
                  <input
                    id="inspection-parity"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0 이상 숫자를 입력해주세요"
                    value={parityStr}
                    onChange={(e) => setParityStr(digitsOnly(e.target.value).slice(0, 2))}
                    className={inputClassName}
                    aria-invalid={showParityError}
                  />
                  {showParityError && (
                    <p className="mt-1.5 text-[12px] text-red-600">0 이상의 숫자를 입력해 주세요.</p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    6. 진단받은 적이 있는 질환을 모두 선택해 주세요
                  </p>
                  <div className="space-y-2.5">
                    {DISEASE_KEYS.map((key) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-start gap-3 rounded-[12px] border border-black/[0.06] bg-[#F8F8FA] px-3 py-2.5 transition ${
                          diseaseDisabled ? 'cursor-not-allowed opacity-45' : 'active:bg-[#F0F0F4]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={conditions[key]}
                          disabled={diseaseDisabled}
                          onChange={() => toggleDisease(key)}
                          className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] border-2 border-[#C8C8D0] text-[#9388FA] accent-[#9388FA] transition focus:ring-2 focus:ring-[#9388FA]/40 disabled:cursor-not-allowed"
                        />
                        <span className="text-[14px] leading-snug text-[#2a2a32]">{DISEASE_LABELS[key]}</span>
                      </label>
                    ))}
                    <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#9388FA]/25 bg-[#F4F2FF] px-3 py-2.5 transition active:bg-[#EDE9FF]">
                      <input
                        type="checkbox"
                        checked={conditions.none}
                        onChange={toggleNone}
                        className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] border-2 border-[#9388FA]/50 text-[#9388FA] accent-[#9388FA] transition focus:ring-2 focus:ring-[#9388FA]/40"
                      />
                      <span className="text-[14px] font-semibold leading-snug text-[#2a2a32]">해당 없음</span>
                    </label>
                  </div>
                  {showConditionsError && (
                    <p className="mt-2 text-[12px] text-red-600">
                      질환을 하나 이상 선택하거나, 「해당 없음」을 선택해 주세요.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="mb-3 text-center text-[14px] font-medium text-white/95">2 / 6</p>
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

export default InspectionFemaleStep2;
