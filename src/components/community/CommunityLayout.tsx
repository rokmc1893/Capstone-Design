import type { ReactNode } from 'react';
import { PenLine } from 'lucide-react';
import { StatusBar } from '../StatusBar';
import { typeCaption, typeScreenTitle } from '../../lib/typography';

type CommunityLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  onWriteClick?: () => void;
  showFab?: boolean;
};

export function CommunityLayout({
  title = '커뮤니티',
  subtitle = '운동·식단·진척도 이야기를 나눠 보세요.',
  children,
  headerExtra,
  onWriteClick,
  showFab = true,
}: CommunityLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="relative z-10 shrink-0 pt-2">
        <StatusBar />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[104px] pt-3">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className={typeScreenTitle}>{title}</h1>
            <p className={`mt-2 ${typeCaption}`}>{subtitle}</p>
          </div>
          {headerExtra}
        </div>
        {children}
      </main>

      {showFab && onWriteClick ? (
        <button
          type="button"
          onClick={onWriteClick}
          className="absolute bottom-[108px] right-8 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FF3AA7] text-white shadow-[0_12px_32px_rgba(255,58,167,0.45)] transition active:scale-95"
          aria-label="글쓰기"
        >
          <PenLine className="h-6 w-6" strokeWidth={2.25} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
