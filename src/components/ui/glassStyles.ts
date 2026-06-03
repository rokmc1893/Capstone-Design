/** 프리미엄 글래스모피즘 — 홈·검사 등 모바일 화면 공통 */

/** 데스크톱: 목업 프레임 · 실제 기기(sm 이하): 화면 전체 */
export const MOBILE_SHELL =
  'flex min-h-screen items-center justify-center bg-[#f4f2fa] p-4 font-sans max-sm:min-h-[100dvh] max-sm:items-stretch max-sm:p-0';

export const MOBILE_FRAME =
  [
    'relative flex h-[844px] w-[390px] flex-col min-h-0 overflow-hidden rounded-[28px]',
    'shadow-[0_24px_80px_rgba(15,23,42,0.35)]',
    /* 목업 프레임 상단 라운드 클리핑 방지 · 실기기는 StatusBar safe-area 사용 */
    'pt-3 max-sm:pt-0',
    'max-sm:h-[100dvh] max-sm:min-h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:rounded-none max-sm:shadow-none',
  ].join(' ');

export const GRADIENT_BG_STYLE = {
  background: 'linear-gradient(180deg, #9B8CF8 0%, #B794F4 42%, #E8A4C8 100%)',
} as const;

export const glassCard =
  'rounded-[24px] border border-white/20 bg-white/[0.08] shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl';

export const glassCardInteractive = [
  glassCard,
  'premium-card',
  'transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
  'hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12]',
  'hover:shadow-[0_28px_64px_rgba(15,23,42,0.3)]',
  'active:scale-[0.98]',
].join(' ');

/** 홈 가로형 CTA 버튼 */
export const glassHomeActionRow = [
  glassCardInteractive,
  'flex w-full flex-row items-center justify-between gap-4 p-5 text-left',
  'min-h-[88px]',
].join(' ');

export const glassStatCard = [
  glassCard,
  'relative overflow-hidden',
  'shadow-[0_16px_40px_rgba(15,23,42,0.2),0_0_40px_rgba(255,255,255,0.06)]',
].join(' ');

/** 홈 — 요약 통계 카드 (서브) */
export const glassHomeStatCard = [
  glassCard,
  'relative overflow-hidden bg-white/[0.10]',
  'border-white/22',
  'shadow-[0_12px_36px_rgba(15,23,42,0.18),0_0_32px_rgba(255,255,255,0.05)]',
].join(' ');

/** 홈 — 메인 CTA (검사하기) */
export const glassHomePrimaryCta = [
  glassCardInteractive,
  'relative flex w-full flex-row items-center justify-between gap-5 text-left',
  'min-h-[104px] p-6',
  'bg-white/[0.20] border-white/32',
  'shadow-[0_22px_56px_rgba(15,23,42,0.3),0_0_56px_rgba(255,255,255,0.14)]',
  'ring-1 ring-white/28',
].join(' ');

/** 홈 — 서브 CTA (검사 상세 리포트 등) */
export const glassHomeSecondaryCta = [
  glassCardInteractive,
  'relative flex w-full flex-row items-center justify-between gap-4 text-left',
  'min-h-[92px] p-5',
  'bg-white/[0.09] border-white/18',
  'shadow-[0_8px_28px_rgba(15,23,42,0.18)]',
].join(' ');

export const glassHomePrimaryIconWell = [
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
  'border border-white/35 bg-white/22',
  'shadow-[0_8px_24px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.5)]',
  'backdrop-blur-md',
].join(' ');

export const glassIconWell =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md';

export const glassSettingsButton =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.12] text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.18] hover:shadow-[0_16px_40px_rgba(15,23,42,0.28)] active:scale-95';

export const glassNavPill =
  'h-[64px] w-full rounded-[32px] border border-white/35 bg-white/[0.72] shadow-[0_16px_48px_rgba(15,23,42,0.18),0_4px_12px_rgba(255,255,255,0.5)] backdrop-blur-xl';

/** 커뮤니티 — 게시글·빈 상태 카드 (soft glass depth) */
export const glassCommunityPostCard = [
  'rounded-[24px]',
  'border border-white/[0.12]',
  'bg-white/[0.11]',
  'shadow-[0_20px_52px_rgba(15,23,42,0.26),0_6px_20px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.18)]',
  'backdrop-blur-2xl',
].join(' ');

/** 커뮤니티 — 카드 내부 여백 (피드·상세 공통) */
export const glassCommunityPostCardPadding = 'px-6 py-6';

/** 커뮤니티 — 신고 등 바텀시트 */
export const glassCommunityBottomSheet = [
  'overflow-hidden rounded-[28px]',
  'border border-white/28',
  'bg-white/[0.14]',
  'shadow-[0_-12px_56px_rgba(15,23,42,0.32),inset_0_1px_0_rgba(255,255,255,0.2)]',
  'backdrop-blur-2xl',
].join(' ');
