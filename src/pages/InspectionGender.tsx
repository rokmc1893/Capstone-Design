import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { useSimulatorStore } from '../store/useSimulatorStore';
import imgMan from '../assets/inspection/man.png';
import imgWoman from '../assets/inspection/woman.png';

/**
 * 검사하기 — 성별 선택 (홈 → 검사하기 → 시뮬레이터 inspection)
 */
const InspectionGender = () => {
  const navigate = useNavigate();
  const setGender = useSimulatorStore((s) => s.setGender);
  const [selected, setSelected] = useState<'male' | 'female' | null>(null);
  const navigateLock = useRef(false);

  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  }, [navigate]);

  const handleSelect = (g: 'male' | 'female') => {
    if (navigateLock.current) return;
    setSelected(g);
    navigateLock.current = true;
    window.setTimeout(() => {
      setGender(g);
      if (g === 'female') navigate('/inspection/female/1');
      else navigate('/inspection/male/1');
      navigateLock.current = false;
    }, 240);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-3 sm:p-4">
      <div
        className="relative flex h-[100dvh] max-h-[852px] w-full max-w-[393px] flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        {/* 홈과 동일한 소프트 글로우 + 블렌드 */}
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

        <main className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-5 pb-8 pt-2 sm:px-6 sm:pb-10">
          <h1 className="text-center text-[30px] font-bold leading-[1.25] tracking-[-0.45px] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.18)] sm:text-[34px]">
            당신의 성별은?
          </h1>

          <div className="mx-auto mt-9 grid w-full max-w-[340px] grid-cols-2 gap-4 sm:mt-11 sm:max-w-[360px] sm:gap-5">
            <button
              type="button"
              onClick={() => handleSelect('male')}
              className={[
                'group relative flex min-h-[268px] flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-[#A4C4FF] to-[#8FB8FF] p-3 shadow-[0_14px_36px_rgba(24,32,64,0.14)] ring-2 ring-transparent transition-all duration-200 ease-out sm:min-h-[288px] sm:rounded-[24px] sm:p-4',
                'active:scale-[0.99]',
                selected === 'male'
                  ? 'z-[1] scale-[1.04] ring-[#9388FA] shadow-[0_16px_40px_rgba(147,136,250,0.35),0_0_0_3px_rgba(147,136,250,0.28)]'
                  : 'hover:brightness-[1.02]',
              ].join(' ')}
            >
              <div className="flex min-h-0 flex-1 flex-col items-center justify-end px-1">
                <img
                  src={imgMan}
                  alt=""
                  className="h-auto max-h-[200px] w-full max-w-[168px] object-contain object-bottom select-none sm:max-h-[216px]"
                  draggable={false}
                />
              </div>
              <span className="mt-2 pb-1 text-center text-[18px] font-bold leading-tight tracking-[-0.2px] text-[#1c2438]">
                남자
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('female')}
              className={[
                'group relative flex min-h-[268px] flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-[#FF9A9A] to-[#FF8A8A] p-3 shadow-[0_14px_36px_rgba(64,24,32,0.12)] ring-2 ring-transparent transition-all duration-200 ease-out sm:min-h-[288px] sm:rounded-[24px] sm:p-4',
                'active:scale-[0.99]',
                selected === 'female'
                  ? 'z-[1] scale-[1.04] ring-[#9388FA] shadow-[0_16px_40px_rgba(147,136,250,0.35),0_0_0_3px_rgba(147,136,250,0.28)]'
                  : 'hover:brightness-[1.02]',
              ].join(' ')}
            >
              <div className="flex min-h-0 flex-1 flex-col items-center justify-end px-1">
                <img
                  src={imgWoman}
                  alt=""
                  className="h-auto max-h-[200px] w-full max-w-[168px] object-contain object-bottom select-none sm:max-h-[216px]"
                  draggable={false}
                />
              </div>
              <span className="mt-2 pb-1 text-center text-[18px] font-bold leading-tight tracking-[-0.2px] text-[#1c2438]">
                여자
              </span>
            </button>
          </div>

          <p className="mt-7 text-center text-[12px] leading-relaxed text-white/88 sm:mt-8">
            성별에 맞는 간단한 설문 후 진단을 이어가요.
          </p>
        </main>
      </div>
    </div>
  );
};

export default InspectionGender;
