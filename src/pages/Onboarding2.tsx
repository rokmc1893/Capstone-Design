import { ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';

const Onboarding2 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] p-3 sm:p-4">
      <div className="relative h-[min(852px,100dvh)] w-full max-w-[393px] overflow-hidden rounded-[28px] bg-white shadow-xl sm:h-[852px]">
        {/* Figma 온보딩2 톤: 상/하 라디얼 블렌드 */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(145% 70% at 53% -8%, rgba(147,136,250,0.70) 0%, rgba(169,160,251,0.70) 0.01%, rgba(212,207,253,0.70) 50%, rgba(255,255,255,0.70) 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(70% 58% at 10% 97%, rgba(224,161,205,0.7) 2.37%, rgba(236,205,227,0.7) 51.19%, rgba(249,249,249,0.7) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[1.5px]" />
        </div>

        <header className="relative z-10 pt-1.5">
          <StatusBar />
          <div className="flex justify-end px-5 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[14px] font-normal tracking-[-0.14px] text-[#9A9A98] active:opacity-70"
            >
              건너뛰기 →
            </button>
          </div>
        </header>

        <main className="relative z-10 flex h-[calc(100%-76px)] flex-col items-center justify-end pb-[42px]">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-3 w-3 rounded-full bg-[#E7E7E6]" />
            <span className="h-3 w-3 rounded-full bg-[#E7E7E6]" />
            <span className="h-3 w-3 rounded-full bg-[#E7E7E6]" />
            <span className="h-3 w-3 rounded-full bg-[#282825]" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex h-[54px] w-[353px] items-center justify-center gap-2 rounded-[50px] bg-[#282825] text-[#E7E7E6] shadow-[0_8px_20px_rgba(40,40,37,0.24)] active:scale-[0.99]"
          >
            <span className="text-[14px] font-bold tracking-[-0.14px]">시작하기</span>
            <ArrowRightCircle size={18} strokeWidth={1.8} />
          </button>
        </main>
      </div>
    </div>
  );
};

export default Onboarding2;
