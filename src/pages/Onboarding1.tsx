import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';

const Onboarding1 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
    >
      <div
        className="relative h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden rounded-[28px] shadow-[0_20px_56px_rgba(147,136,250,0.35)]"
        style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-white/25 blur-[56px]" />
          <div className="absolute top-[36%] -right-20 h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/45 blur-[64px]" />
          <div className="absolute -bottom-16 -left-16 h-[220px] w-[220px] rounded-full bg-[#9388FA]/35 blur-[50px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-white/[0.08]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
          <div className="flex justify-end px-5 pt-1">
            <button
              type="button"
              onClick={() => navigate('/onboarding/4')}
              className="text-[14px] text-white/70 transition active:opacity-70"
            >
              건너뛰기 →
            </button>
          </div>
        </header>

        <main className="relative z-10 flex h-[calc(100%-78px)] flex-col px-7 pb-9 pt-4 text-center">
          <div className="flex flex-1 flex-col items-center">
            <div className="mt-4 w-full max-w-[278px]">
              <img
                src="/Onboarding1.png"
                alt="온보딩 일러스트"
                className="h-auto w-full object-contain"
                loading="eager"
              />
            </div>

            <h1 className="mt-8 whitespace-pre-line type-ink-title-xl whitespace-pre-line">
              {'작은 습관이\n큰 변화를 만듭니다'}
            </h1>

            <p className="mt-4 whitespace-pre-line type-ink-body-sm whitespace-pre-line">
              {'내 몸의 컨디션은\n이미 신호를 보내고 있어요\n건강한 시작을 함께 준비해요'}
            </p>
          </div>

          <div className="mb-5 flex items-center justify-center gap-2.5">
            <span className="h-2.5 w-6 rounded-full bg-[#2A2A2A]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/onboarding/2')}
            className="h-[56px] w-full rounded-[28px] bg-[#EAEAEA] text-[16px] font-semibold tracking-[-0.01em] text-[#4A4A4A] shadow-[0_8px_20px_rgba(0,0,0,0.10)] transition active:scale-[0.99]"
          >
            다음으로
          </button>
        </main>
      </div>
    </div>
  );
};

export default Onboarding1;
