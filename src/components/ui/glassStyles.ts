/** 프리미엄 글래스모피즘 — 홈·검사 등 모바일 화면 공통 */

export const MOBILE_FRAME =
  'relative flex h-[844px] w-[390px] flex-col min-h-0 overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(15,23,42,0.35)]';

export const GRADIENT_BG_STYLE = {
  background: 'linear-gradient(180deg, #9B8CF8 0%, #B794F4 42%, #E8A4C8 100%)',
} as const;

export const glassCard =
  'rounded-[24px] border border-white/20 bg-white/[0.08] shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl';

export const glassCardInteractive = [
  glassCard,
  'transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]',
  'hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12]',
  'hover:shadow-[0_28px_64px_rgba(15,23,42,0.3)]',
  'active:scale-[0.98]',
].join(' ');

export const glassStatCard = [
  glassCard,
  'relative overflow-hidden',
  'shadow-[0_16px_40px_rgba(15,23,42,0.2),0_0_40px_rgba(255,255,255,0.06)]',
].join(' ');

export const glassIconWell =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md';

export const glassSettingsButton =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.12] text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.18] hover:shadow-[0_16px_40px_rgba(15,23,42,0.28)] active:scale-95';

export const glassNavPill =
  'h-[64px] w-full rounded-[32px] border border-white/35 bg-white/[0.72] shadow-[0_16px_48px_rgba(15,23,42,0.18),0_4px_12px_rgba(255,255,255,0.5)] backdrop-blur-xl';
