import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import type { DrinkStatus, MaleConditions, SmokeStatus } from '../store/useSimulatorStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

const emptyMaleConditions = (): MaleConditions => ({
  chlam: false,
  gon: false,
  none: false,
});

/** 남성 검사 설문 Step 3/7 */
const InspectionMaleStep3 = () => {
  const navigate = useNavigate();
  const gender = useSimulatorStore((s) => s.gender);
  const applyInspectionMaleStep3 = useSimulatorStore((s) => s.applyInspectionMaleStep3);

  const [conditions, setConditions] = useState<MaleConditions>(emptyMaleConditions);
  const [smokeStatus, setSmokeStatus] = useState<SmokeStatus | null>(null);
  const [drinkStatus, setDrinkStatus] = useState<DrinkStatus | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gender !== 'male') navigate('/inspection', { replace: true });
  }, [gender, navigate]);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const s = useSimulatorStore.getState();
    if (s.maleConditions && Object.values(s.maleConditions).some(Boolean)) {
      setConditions({ ...emptyMaleConditions(), ...s.maleConditions });
    }
    setSmokeStatus(s.smokeStatus);
    setDrinkStatus(s.drinkStatus);
  }, []);

  const validation = useMemo(() => {
    const anyDisease = conditions.chlam || conditions.gon;
    const conditionOk = (conditions.none && !anyDisease) || (!conditions.none && anyDisease);
    return {
      conditionOk,
      smokeOk: smokeStatus !== null,
      drinkOk: drinkStatus !== null,
      isValid: conditionOk && smokeStatus !== null && drinkStatus !== null,
    };
  }, [conditions, smokeStatus, drinkStatus]);

  const showConditionError = touched && !validation.conditionOk;
  const showSmokeError = touched && !validation.smokeOk;
  const showDrinkError = touched && !validation.drinkOk;

  const diseaseDisabled = conditions.none;

  const toggleDisease = (key: 'chlam' | 'gon') => {
    if (conditions.none) return;
    setConditions((prev) => ({
      ...prev,
      none: false,
      [key]: !prev[key],
    }));
  };

  const toggleNone = () => {
    setConditions((prev) => {
      if (prev.none) return { ...emptyMaleConditions() };
      return { ...emptyMaleConditions(), none: true };
    });
  };

  const onNext = useCallback(() => {
    setTouched(true);
    if (!validation.isValid || smokeStatus == null || drinkStatus == null) return;
    applyInspectionMaleStep3({
      maleConditions: { ...conditions },
      smokeStatus,
      drinkStatus,
    });
    navigate('/inspection/male/4');
  }, [applyInspectionMaleStep3, conditions, drinkStatus, navigate, smokeStatus, validation.isValid]);

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
            onClick={() => navigate('/inspection/male/2')}
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

        <div className="relative z-10 shrink-0 px-5 pb-3 pt-1 sm:px-6">
          <h1 className="text-center text-[20px] font-bold leading-[1.45] tracking-[-0.35px] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.14)] sm:text-[22px]">
            간단한 질문 몇 가지로
            <br />
            현재 몸 상태를 진단해볼게요!
          </h1>
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 sm:px-6">
          <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
            <div className="mx-auto w-full max-w-[350px] rounded-[22px] bg-white/95 p-5 shadow-[0_16px_48px_rgba(24,24,48,0.12)] ring-1 ring-white/70 backdrop-blur-sm sm:rounded-[24px] sm:p-6">
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    7. 진단받은 적이 있는 질환을 모두 선택해 주세요
                  </p>
                  <div className="space-y-2.5">
                    <label className={`flex cursor-pointer items-start gap-3 rounded-[12px] border border-black/[0.06] bg-[#F8F8FA] px-3 py-2.5 transition ${diseaseDisabled ? 'cursor-not-allowed opacity-45' : 'active:bg-[#F0F0F4]'}`}>
                      <input
                        type="checkbox"
                        checked={conditions.chlam}
                        disabled={diseaseDisabled}
                        onChange={() => toggleDisease('chlam')}
                        className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] border-2 border-[#C8C8D0] text-[#9388FA] accent-[#9388FA] transition focus:ring-2 focus:ring-[#9388FA]/40 disabled:cursor-not-allowed"
                      />
                      <span className="text-[14px] leading-snug text-[#2a2a32]">클라미디아</span>
                    </label>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-[12px] border border-black/[0.06] bg-[#F8F8FA] px-3 py-2.5 transition ${diseaseDisabled ? 'cursor-not-allowed opacity-45' : 'active:bg-[#F0F0F4]'}`}>
                      <input
                        type="checkbox"
                        checked={conditions.gon}
                        disabled={diseaseDisabled}
                        onChange={() => toggleDisease('gon')}
                        className="mt-0.5 h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] border-2 border-[#C8C8D0] text-[#9388FA] accent-[#9388FA] transition focus:ring-2 focus:ring-[#9388FA]/40 disabled:cursor-not-allowed"
                      />
                      <span className="text-[14px] leading-snug text-[#2a2a32]">임질</span>
                    </label>
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
                  {showConditionError && (
                    <p className="mt-2 text-[12px] text-red-600">질환을 선택하거나 「해당 없음」을 선택해 주세요.</p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    8. 최근 한 달간 흡연을 얼마나 하셨나요?
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { value: 'none', label: '안 피움' },
                      { value: 'sometimes', label: '가끔 피움' },
                      { value: 'daily', label: '매일 피움' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSmokeStatus(opt.value as SmokeStatus)}
                        className={`w-full rounded-[12px] border px-3 py-3 text-left text-[14px] font-semibold transition ${
                          smokeStatus === opt.value
                            ? 'border-[#9388FA] bg-[#9388FA] text-white shadow-[0_8px_20px_rgba(147,136,250,0.25)]'
                            : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {showSmokeError && (
                    <p className="mt-2 text-[12px] text-red-600">흡연 상태를 하나 선택해 주세요.</p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-[15px] font-semibold leading-snug text-[#2a2a32]">
                    9. 최근 1년간 음주 빈도는 어떻게 되시나요?
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { value: 'none', label: '안 마심' },
                      { value: 'monthly1to3', label: '월 1~3회' },
                      { value: 'weeklyOrMore', label: '주 1회 이상' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDrinkStatus(opt.value as DrinkStatus)}
                        className={`w-full rounded-[12px] border px-3 py-3 text-left text-[14px] font-semibold transition ${
                          drinkStatus === opt.value
                            ? 'border-[#9388FA] bg-[#9388FA] text-white shadow-[0_8px_20px_rgba(147,136,250,0.25)]'
                            : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {showDrinkError && (
                    <p className="mt-2 text-[12px] text-red-600">음주 빈도를 하나 선택해 주세요.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[350px] shrink-0 pt-1 sm:mt-5">
            <p className="mb-3 text-center text-[14px] font-medium text-white/95">3 / 7</p>
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

export default InspectionMaleStep3;
