/** 스크롤 시 상단 glass fade — 콘텐츠가 헤더 아래로 자연스럽게 지나감 */

type ScrollTopChromeProps = {
  active?: boolean;
};

export function ScrollTopChrome({ active = false }: ScrollTopChromeProps) {
  return (
    <div
      className={[
        'pointer-events-none sticky top-0 z-[5] -mb-3 h-3 w-full shrink-0 transition-opacity duration-300 ease-out',
        active ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      aria-hidden
    >
      <div className="h-12 w-full bg-gradient-to-b from-[#9B8CF8]/50 via-[#B794F4]/22 to-transparent backdrop-blur-[12px]" />
    </div>
  );
}
