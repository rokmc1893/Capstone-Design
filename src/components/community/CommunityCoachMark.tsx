import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  anchorRectInFrame,
  COACH_CARD_FALLBACK_HEIGHT,
  computeCoachMarkPlacement,
  getCoachMarkInsets,
  resolveCoachMarkCollision,
  type CoachMarkPlacement,
} from '../../lib/community/coachMarkLayout';
import {
  getCommunityHintCopy,
  useCommunityGuideStore,
} from '../../store/useCommunityGuideStore';
import { communityEaseSoft } from '../../lib/community/interactionMotion';
import {
  getMobileFrameRect,
  getOverlayRootElement,
} from '../../lib/mobileFrame';
import type { CommunityHintKey } from '../../types/community';

type CommunityCoachMarkProps = {
  hintKey: CommunityHintKey | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onComplete?: () => void;
  /** 글쓰기 FAB 영역 확보 (커뮤니티 목록) */
  reserveFab?: boolean;
};

export function CommunityCoachMark({
  hintKey,
  anchorRect,
  onClose,
  onComplete,
  reserveFab = true,
}: CommunityCoachMarkProps) {
  const dismissForSession = useCommunityGuideStore((s) => s.dismissForSession);
  const dismissPermanently = useCommunityGuideStore((s) => s.dismissPermanently);
  const completeHintStore = useCommunityGuideStore((s) => s.completeHint);

  const [visible, setVisible] = useState(false);
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(null);
  const [placement, setPlacement] = useState<CoachMarkPlacement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rawMaskId = useId();
  const maskId = `coach-spotlight-${rawMaskId.replace(/:/g, '')}`;

  const insets = useMemo(() => getCoachMarkInsets(reserveFab), [reserveFab]);

  const recomputePlacement = useCallback(() => {
    const frame = getMobileFrameRect();
    if (!frame) return;

    const measured = cardRef.current?.getBoundingClientRect().height;
    const height =
      measured && measured > 0 ? measured : COACH_CARD_FALLBACK_HEIGHT;

    let next = computeCoachMarkPlacement(anchorRect, height, insets, frame);

    if (anchorRect) {
      const anchorFrame = anchorRectInFrame(anchorRect, frame);
      next = resolveCoachMarkCollision(next, height, anchorFrame, frame, insets);
    }

    setPlacement(next);
  }, [anchorRect, insets]);

  useEffect(() => {
    setVisible(Boolean(hintKey));
  }, [hintKey]);

  useEffect(() => {
    if (!hintKey) {
      setOverlayRoot(null);
      setPlacement(null);
      return;
    }
    setOverlayRoot(getOverlayRootElement());
  }, [hintKey]);

  useLayoutEffect(() => {
    if (!visible || !hintKey) return;
    recomputePlacement();
  }, [visible, hintKey, anchorRect, recomputePlacement]);

  useEffect(() => {
    if (!visible || !hintKey) return;

    const card = cardRef.current;
    if (!card) return;

    const observer = new ResizeObserver(() => recomputePlacement());
    observer.observe(card);
    return () => observer.disconnect();
  }, [visible, hintKey, recomputePlacement]);

  useEffect(() => {
    if (!visible || !hintKey) return;
    const onReflow = () => recomputePlacement();
    window.addEventListener('resize', onReflow);
    window.visualViewport?.addEventListener('resize', onReflow);
    return () => {
      window.removeEventListener('resize', onReflow);
      window.visualViewport?.removeEventListener('resize', onReflow);
    };
  }, [visible, hintKey, recomputePlacement]);

  const copy = hintKey ? getCommunityHintCopy(hintKey) : null;

  const anchorInFrame = useMemo(() => {
    if (!anchorRect) return null;
    const frame = getMobileFrameRect();
    if (!frame) return null;
    return anchorRectInFrame(anchorRect, frame);
  }, [anchorRect]);

  const finish = (mode: 'skip' | 'never' | 'next') => {
    if (!hintKey) return;
    if (mode === 'never') dismissPermanently(hintKey);
    else if (mode === 'skip') dismissForSession(hintKey);
    else completeHintStore(hintKey);

    setVisible(false);
    if (mode === 'next') onComplete?.();
    onClose();
  };

  const spotlightRadius = anchorInFrame
    ? Math.min(20, Math.max(12, Math.min(anchorInFrame.width, anchorInFrame.height) * 0.22))
    : 16;

  const cardStyle = placement ?? {
    left: insets.marginX,
    width: 280,
    bottom: insets.bottomClear,
  };

  const overlay = (
    <AnimatePresence>
      {visible && copy && overlayRoot ? (
        <motion.div
          className="pointer-events-auto absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: communityEaseSoft }}
          role="presentation"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-[#1e1830]/42 backdrop-blur-[5px]"
            aria-label="가이드 닫기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => finish('skip')}
          />

          {anchorInFrame ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <mask id={maskId}>
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={anchorInFrame.x}
                    y={anchorInFrame.y}
                    width={anchorInFrame.width}
                    height={anchorInFrame.height}
                    rx={spotlightRadius}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(30,24,48,0.38)"
                mask={`url(#${maskId})`}
              />
            </svg>
          ) : null}

          {anchorInFrame ? (
            <motion.div
              className="pointer-events-none absolute ring-2 ring-white/45"
              style={{
                left: anchorInFrame.x,
                top: anchorInFrame.y,
                width: anchorInFrame.width,
                height: anchorInFrame.height,
                borderRadius: spotlightRadius,
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: [0.5, 0.95, 0.6],
                scale: [0.98, 1.02, 1],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            />
          ) : null}

          <motion.div
            ref={cardRef}
            role="dialog"
            aria-labelledby="coach-mark-title"
            aria-modal="true"
            className="absolute z-[2] box-border max-h-[min(72dvh,520px)] overflow-y-auto overscroll-contain rounded-[22px] border border-white/28 bg-white/[0.15] px-5 py-5 shadow-[0_20px_52px_rgba(15,23,42,0.3)] backdrop-blur-xl"
            style={cardStyle}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.34, ease: communityEaseSoft }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold tracking-[0.06em] text-white/50">
              잠깐만요
            </p>
            <h3
              id="coach-mark-title"
              className="mt-1 text-[17px] font-bold tracking-[-0.03em] text-white/96"
            >
              {copy.title}
            </h3>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-[1.68] text-white/80">
              {copy.body}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => finish('skip')}
                  className="rounded-full px-3 py-2 text-[13px] font-medium text-white/58 transition active:bg-white/10"
                >
                  건너뛰기
                </button>
                <button
                  type="button"
                  onClick={() => finish('never')}
                  className="shrink-0 rounded-full px-3 py-2 text-[13px] font-medium text-white/58 transition active:bg-white/10"
                >
                  다시 보지 않기
                </button>
              </div>
              <button
                type="button"
                onClick={() => finish('next')}
                className="w-full rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-[#7B6EE8] shadow-[0_4px_14px_rgba(123,110,232,0.28)] transition active:scale-[0.98] sm:ml-auto sm:w-auto"
              >
                다음
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!overlayRoot) return null;
  return createPortal(overlay, overlayRoot);
}
