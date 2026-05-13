import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

/** Step 4~6 확장 전 임시 화면 */
const InspectionFemaleStep4 = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/inspection/female/3')}
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

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
          <p className="text-[15px] font-semibold text-white/95">4 / 6</p>
          <p className="mt-3 text-[16px] leading-relaxed text-white/90">이후 단계 UI는 준비 중이에요.</p>
          <button
            type="button"
            onClick={() => navigate('/inspection-reports/archive')}
            className="mt-8 w-full max-w-[280px] rounded-[16px] bg-[#9388FA] py-4 text-[17px] font-bold text-white shadow-[0_10px_28px_rgba(32,24,64,0.2)] active:scale-[0.99]"
          >
            상세 리포트 · 기록 보기
          </button>
        </main>
      </div>
    </div>
  );
};

export default InspectionFemaleStep4;
