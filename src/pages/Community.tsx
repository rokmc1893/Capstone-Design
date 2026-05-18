import { MessageCircle } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { GRADIENT_BG_STYLE, MOBILE_FRAME } from '../components/ui/glassStyles';
import { typeBody, typeCardDesc, typeCardTitle, typeScreenTitle } from '../lib/typography';

/** 커뮤니티 탭 전용 화면 (로그인 화면과 분리) */
const Community = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2fa] p-4 font-sans">
      <div className={MOBILE_FRAME} style={GRADIENT_BG_STYLE}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
        </header>

        <main className="relative z-10 flex flex-col px-6 pb-28 pt-6">
          <h1 className={typeScreenTitle}>커뮤니티</h1>
          <p className={`mt-2.5 ${typeBody}`}>이야기를 나누고 정보를 공유해 보세요.</p>

          <div className="mt-8 flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl">
            <MessageCircle className="h-12 w-12 text-white/85" strokeWidth={1.5} aria-hidden />
            <p className={`mt-5 ${typeCardTitle}`}>
              곧 게시글과 댓글을
              <br />
              이용할 수 있어요
            </p>
            <p className={`mt-2.5 ${typeCardDesc}`}>준비 중인 기능입니다.</p>
          </div>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Community;
