import type { ReactNode } from 'react';
import { PenLine } from 'lucide-react';
import { StatusBar } from '../StatusBar';
import { typeScreenTitle } from '../../lib/typography';

type CommunityLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  onWriteClick?: () => void;
  showFab?: boolean;
  /** 스크롤 시 상단 glass chrome */
  headerScrolled?: boolean;
};

export function CommunityLayout({
  title = '커뮤니티',
  subtitle = '운동·식단·진척도 이야기를 나눠 보세요.',
  children,
  headerExtra,
  onWriteClick,
  showFab = true,
  headerScrolled = false,
}: CommunityLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header
        className={[
          'scroll-chrome-header relative z-10 shrink-0 pt-2',
          headerScrolled ? 'is-scrolled' : '',
        ].join(' ')}
      >
        <StatusBar />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[108px] pt-5">
        <div
          className={[
            'scroll-chrome-title flex shrink-0 items-start justify-between gap-4 pb-4 transition',
            headerScrolled ? 'opacity-90' : '',
          ].join(' ')}
        >
          <div className="min-w-0">
            <h1 className={typeScreenTitle}>{title}</h1>
            <p className={`mt-3 max-w-[280px] text-[13px] leading-[1.65] tracking-[-0.015em] text-white/55`}>
              {subtitle}
            </p>
          </div>
          {headerExtra}
        </div>
        {children}
      </main>

      {showFab && onWriteClick ? (
        <button
          type="button"
          onClick={onWriteClick}
          className={[
            'absolute bottom-[108px] right-8 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full',
            'bg-[#FF3AA7] text-white shadow-[0_12px_32px_rgba(255,58,167,0.45)]',
            'transition-transform duration-200 active:scale-95',
          ].join(' ')}
          aria-label="글쓰기"
        >
          <PenLine className="h-6 w-6" strokeWidth={2.25} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
