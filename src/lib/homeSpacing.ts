/**
 * 홈 화면 spacing — 8pt grid (8·16·24·32·40·48)
 * Toss 여백감 + Apple Health 계층 구조
 */

/** 페이지 — 좌우 24px, 상단 40px (하단 스페이서는 Home.tsx) */
export const homePage =
  'premium-scroll premium-scroll--custom-rail relative flex min-h-0 flex-1 flex-col overflow-x-hidden px-6 pt-10';

/** 하단 탭(≈120px) + CTA 그림자 여유 — Home 맨 아래 스페이서 */
export const HOME_TAB_SCROLL_SPACER_PX = 168;

/** 주요 섹션 사이 (인사 ↔ 통계 ↔ CTA) */
export const homeSectionGap = 'mt-8';

/** 작은 인사 ↔ 케어 헤드라인 */
export const homeHeroStack = 'mt-5';

/** 상단 통계 카드 2열 */
export const homeStatsGrid = 'grid grid-cols-2 gap-5';

/** 통계 카드 공통 */
export const homeStatCardShell = 'flex min-h-[164px] flex-col px-5 py-5';

/** 통계 라벨 ↔ 본문 */
export const homeStatBody = 'mt-4 flex min-h-0 flex-1 flex-col';

/** 주요 요인 칩 스택 */
export const homeFactorStack = 'flex flex-col gap-2';

/** 주요 요인 칩 */
export const homeFactorChip =
  'inline-flex max-w-full truncate rounded-full border border-white/22 bg-white/14 px-3 py-1.5';

/** CTA 섹션 — 카드 간 분리감 */
export const homeCtaStack = 'flex flex-col gap-6';

/** CTA 본문 (제목 ↔ 부제) */
export const homeCtaTextStack = 'mt-2';
