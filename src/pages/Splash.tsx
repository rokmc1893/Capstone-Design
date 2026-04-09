import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';

/** Figma 스플래시(25:1459): 배경 + 상태바만 표시. 배경은 로그인/홈과 동일 그라데이션 유지 */
const SPLASH_DURATION_MS = 2500;

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const id = window.setTimeout(() => {
      navigate('/onboarding/1', { replace: true });
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div
        className="relative flex min-h-[852px] w-[393px] flex-col overflow-hidden rounded-3xl shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)',
        }}
        role="presentation"
      >
        {/* 로그인·홈과 동일한 소프트 글로우 레이어 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
        </header>

        {/* 본문 영역: Figma와 같이 로고/버튼 없이 여백만 */}
        <main
          className="relative z-10 min-h-0 flex-1"
          aria-label="앱 시작 화면"
        />
      </div>
    </div>
  );
};

export default Splash;
