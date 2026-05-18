import { MessageCircle } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { typeBody, typeCardDesc, typeCardTitle, typeScreenTitle } from '../lib/typography';

/** 커뮤니티 탭 전용 화면 (로그인 화면과 분리) */
const Community = () => {
  return (
    <>
      <header className="relative z-10 shrink-0 pt-2">
        <StatusBar />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-[104px] pt-3">
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
    </>
  );
};

export default Community;
