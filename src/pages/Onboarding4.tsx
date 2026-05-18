import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';

/** 온보딩 Step 4/4 — 일러스트 없이 CTA 집중, 로그인(회원가입) 화면으로 이동 */
const Onboarding4 = () => {
  const navigate = useNavigate();

  const goLogin = () => navigate('/login', { replace: true });

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
    >
      <div
        className="relative flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] shadow-[0_20px_56px_rgba(147,136,250,0.35)]"
        style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-white/25 blur-[56px]" />
          <div className="absolute top-[36%] -right-20 h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/45 blur-[64px]" />
          <div className="absolute -bottom-16 -left-16 h-[220px] w-[220px] rounded-full bg-[#9388FA]/35 blur-[50px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-white/[0.08]" />
        </div>

        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
        </header>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col px-7 pb-9 pt-2 text-center">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1">
            <h1 className="whitespace-pre-line text-[40px] font-bold leading-[1.18] tracking-[-0.03em] text-[#141414] sm:text-[44px]">
              {'지금 바로\n시작해보세요'}
            </h1>
            <p className="mt-6 max-w-[300px] whitespace-pre-line text-[17px] leading-[1.65] tracking-[-0.02em] text-[#2a2a2a]/82">
              {'당신의 현재 상태를 확인하고\n변화를 만들어보세요'}
            </p>
          </div>

          <div className="shrink-0">
            <div className="mb-5 flex items-center justify-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-6 rounded-full bg-[#2A2A2A]" />
            </div>

            <button
              type="button"
              onClick={goLogin}
              className="h-[56px] w-full rounded-[28px] bg-black type-inspect-cta tracking-[-0.02em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.2)] transition active:scale-[0.99] active:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              시작하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding4;
