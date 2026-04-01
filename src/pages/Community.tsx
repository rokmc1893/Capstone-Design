import { MessageCircle } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';

/** 커뮤니티 탭 전용 화면 (로그인 화면과 분리) */
const Community = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative h-[844px] w-[390px] overflow-hidden rounded-[28px] shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
        </header>

        <main className="relative z-10 flex flex-col px-6 pb-28 pt-6">
          <h1 className="text-[22px] font-bold leading-[28px] tracking-[-0.3px] text-white">
            커뮤니티
          </h1>
          <p className="mt-2 text-[14px] leading-[20px] text-white/85">
            이야기를 나누고 정보를 공유해 보세요.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center rounded-[22px] bg-white/12 px-6 py-14 text-center ring-1 ring-white/25 backdrop-blur-xl">
            <MessageCircle
              className="h-12 w-12 text-white/90"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="mt-4 text-[15px] font-medium text-white">
              곧 게시글과 댓글을
              <br />
              이용할 수 있어요
            </p>
            <p className="mt-2 text-[12px] text-white/75">
              준비 중인 기능입니다.
            </p>
          </div>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Community;
