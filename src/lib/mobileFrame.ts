/** MainTabLayout MOBILE_FRAME — 오버레이·코치마크 좌표 기준 */
export const MOBILE_FRAME_SELECTOR = '[data-mobile-frame]';

/** bottom-10(40px) + 탭 pill(64px) + 여유 */
export const BOTTOM_TAB_RESERVED_PX = 108;

/** 글쓰기 FAB(h-14) + 탭 위 간격 */
export const COMMUNITY_FAB_RESERVED_PX = 56;

/** 코치마크·프레임 라운드 클리핑 여유 */
export const COACH_MARK_FRAME_MARGIN_X = 28;
export const COACH_MARK_FRAME_MARGIN_TOP = 24;
export const COACH_MARK_BOTTOM_CLEARANCE_PX =
  BOTTOM_TAB_RESERVED_PX + COMMUNITY_FAB_RESERVED_PX + 32;

export function getMobileFrameElement(): HTMLElement | null {
  return document.querySelector(MOBILE_FRAME_SELECTOR);
}

export function getMobileFrameRect(): DOMRect | null {
  return getMobileFrameElement()?.getBoundingClientRect() ?? null;
}

/** 코치마크·모달 — 하단 탭 위 최상단 레이어 */
export const OVERLAY_ROOT_SELECTOR = '[data-overlay-root]';

export function getOverlayRootElement(): HTMLElement | null {
  return document.querySelector(OVERLAY_ROOT_SELECTOR);
}
