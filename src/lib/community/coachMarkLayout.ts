import {
  BOTTOM_TAB_RESERVED_PX,
  COACH_MARK_BOTTOM_CLEARANCE_PX,
  COACH_MARK_FRAME_MARGIN_TOP,
  COACH_MARK_FRAME_MARGIN_X,
} from '../mobileFrame';

export const COACH_MARK_GAP = 14;

/** 카드 높이 측정 전 초기값 */
export const COACH_CARD_FALLBACK_HEIGHT = 268;

export type CoachMarkInsets = {
  marginX: number;
  marginTop: number;
  bottomClear: number;
};

export type CoachMarkPlacement = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
};

export function getCoachMarkInsets(reserveFab = true): CoachMarkInsets {
  return {
    marginX: COACH_MARK_FRAME_MARGIN_X,
    marginTop: COACH_MARK_FRAME_MARGIN_TOP,
    bottomClear: reserveFab
      ? COACH_MARK_BOTTOM_CLEARANCE_PX
      : BOTTOM_TAB_RESERVED_PX + 28,
  };
}

export function anchorRectInFrame(anchor: DOMRect, frame: DOMRect): DOMRect {
  return new DOMRect(
    anchor.x - frame.left,
    anchor.y - frame.top,
    anchor.width,
    anchor.height,
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function cardTopFromBottom(frameHeight: number, bottom: number, cardHeight: number) {
  return frameHeight - bottom - cardHeight;
}

/** 앵커·카드·프레임 안전 영역을 고려해 코치 카드 위치 결정 */
export function computeCoachMarkPlacement(
  anchorRect: DOMRect | null,
  cardHeight: number,
  insets: CoachMarkInsets,
  frame: DOMRect,
): CoachMarkPlacement {
  const { marginX, marginTop, bottomClear } = insets;
  const left = marginX;
  const width = Math.max(0, frame.width - marginX * 2);
  const minTop = marginTop;
  const maxTop = Math.max(minTop, frame.height - bottomClear - cardHeight);

  if (!anchorRect) {
    const top = clamp((minTop + maxTop) / 2, minTop, maxTop);
    return { left, width, top };
  }

  const anchorTop = anchorRect.top - frame.top;
  const anchorBottom = anchorRect.bottom - frame.top;
  const anchorInLowerHalf = anchorBottom > frame.height * 0.4;

  type Candidate = { top?: number; bottom?: number; priority: number };
  const candidates: Candidate[] = [];

  const topAbove = anchorTop - COACH_MARK_GAP - cardHeight;
  if (topAbove >= minTop) {
    const bottom = frame.height - anchorTop + COACH_MARK_GAP;
    candidates.push({
      bottom: clamp(bottom, bottomClear, frame.height - minTop - cardHeight),
      priority: anchorInLowerHalf ? 4 : 2,
    });
  }

  const topBelow = anchorBottom + COACH_MARK_GAP;
  if (topBelow <= maxTop) {
    candidates.push({
      top: clamp(topBelow, minTop, maxTop),
      priority: anchorInLowerHalf ? 1 : 3,
    });
  }

  candidates.push({
    top: clamp((minTop + maxTop) / 2, minTop, maxTop),
    priority: 0,
  });

  candidates.sort((a, b) => b.priority - a.priority);

  for (const candidate of candidates) {
    if (candidate.top !== undefined) {
      const top = clamp(candidate.top, minTop, maxTop);
      if (top + cardHeight <= frame.height - bottomClear + 1) {
        return { left, width, top };
      }
    }

    if (candidate.bottom !== undefined) {
      const bottom = clamp(candidate.bottom, bottomClear, frame.height - minTop - cardHeight);
      const top = cardTopFromBottom(frame.height, bottom, cardHeight);
      if (top >= minTop && top + cardHeight <= frame.height - bottomClear + 1) {
        return { left, width, bottom };
      }
    }
  }

  return { left, width, top: minTop };
}

/** 카드가 앵커(스포트라이트)와 겹치면 위치 재조정 */
export function resolveCoachMarkCollision(
  placement: CoachMarkPlacement,
  cardHeight: number,
  anchorInFrame: DOMRect | null,
  frame: DOMRect,
  insets: CoachMarkInsets,
): CoachMarkPlacement {
  if (!anchorInFrame) return placement;

  const cardTop =
    placement.top ??
    (placement.bottom !== undefined
      ? cardTopFromBottom(frame.height, placement.bottom, cardHeight)
      : insets.marginTop);
  const cardBottom = cardTop + cardHeight;
  const pad = 8;
  const overlaps =
    cardBottom > anchorInFrame.top - pad && cardTop < anchorInFrame.bottom + pad;

  if (!overlaps) return placement;

  const aboveTop = anchorInFrame.top - COACH_MARK_GAP - cardHeight;
  if (aboveTop >= insets.marginTop) {
    return {
      ...placement,
      top: aboveTop,
      bottom: undefined,
    };
  }

  const belowTop = anchorInFrame.bottom + COACH_MARK_GAP;
  const maxTop = frame.height - insets.bottomClear - cardHeight;
  if (belowTop <= maxTop) {
    return {
      ...placement,
      top: belowTop,
      bottom: undefined,
    };
  }

  return placement;
}
