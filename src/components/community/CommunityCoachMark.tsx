import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getCommunityHintCopy,
  useCommunityGuideStore,
} from '../../store/useCommunityGuideStore';
import { communityEaseSoft } from '../../lib/community/interactionMotion';
import type { CommunityHintKey } from '../../types/community';

type CommunityCoachMarkProps = {
  hintKey: CommunityHintKey | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onComplete?: () => void;
};

type TooltipStyle = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
};

function tooltipPosition(rect: DOMRect | null): TooltipStyle {
  const margin = 20;
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const cardWidth = Math.min(320, Math.max(0, viewportWidth - margin * 2));
  const maxLeft = Math.max(margin, viewportWidth - cardWidth - margin);
  const left = rect
    ? Math.max(margin, Math.min(rect.left + rect.width / 2 - cardWidth / 2, maxLeft))
    : margin;

  if (!rect) {
    return { bottom: 120, left, width: cardWidth };
  }

  const spaceBelow = viewportHeight - rect.bottom;
  if (spaceBelow > 200) {
    return { top: rect.bottom + 14, left, width: cardWidth };
  }
  return { bottom: viewportHeight - rect.top + 14, left, width: cardWidth };
}

export function CommunityCoachMark({
  hintKey,
  anchorRect,
  onClose,
  onComplete,
}: CommunityCoachMarkProps) {
  const dismissForSession = useCommunityGuideStore((s) => s.dismissForSession);
  const dismissPermanently = useCommunityGuideStore((s) => s.dismissPermanently);
  const completeHintStore = useCommunityGuideStore((s) => s.completeHint);

  const [visible, setVisible] = useState(false);
  const rawMaskId = useId();
  const maskId = `coach-spotlight-${rawMaskId.replace(/:/g, '')}`;

  useEffect(() => {
    setVisible(Boolean(hintKey));
  }, [hintKey]);

  const copy = hintKey ? getCommunityHintCopy(hintKey) : null;
  const tooltipStyle = useMemo(() => tooltipPosition(anchorRect), [anchorRect]);

  const finish = (mode: 'skip' | 'never' | 'next') => {
    if (!hintKey) return;
    if (mode === 'never') dismissPermanently(hintKey);
    else if (mode === 'skip') dismissForSession(hintKey);
    else completeHintStore(hintKey);

    setVisible(false);
    if (mode === 'next') onComplete?.();
    onClose();
  };

  const spotlightRadius = anchorRect
    ? Math.min(20, Math.max(12, Math.min(anchorRect.width, anchorRect.height) * 0.22))
    : 16;

  return (
    <AnimatePresence>
      {visible && copy ? (
        <motion.div
          className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: communityEaseSoft }}
          role="presentation"
        >
          {/* dim + blur */}
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

          {/* spotlight hole (SVG mask) */}
          {anchorRect ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <mask id={maskId}>
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={anchorRect.x}
                    y={anchorRect.y}
                    width={anchorRect.width}
                    height={anchorRect.height}
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

          {/* focus ring pulse */}
          {anchorRect ? (
            <motion.div
              className="pointer-events-none absolute rounded-[16px] ring-2 ring-white/45"
              style={{
                left: anchorRect.x,
                top: anchorRect.y,
                width: anchorRect.width,
                height: anchorRect.height,
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

          {/* coach card */}
          <motion.div
            role="dialog"
            aria-labelledby="coach-mark-title"
            aria-modal="true"
            className="fixed z-[76] rounded-[22px] border border-white/28 bg-white/[0.15] px-5 py-5 shadow-[0_20px_52px_rgba(15,23,42,0.3)] backdrop-blur-xl"
            style={tooltipStyle}
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
            <div className="mt-5 flex flex-wrap items-center gap-2">
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
                className="rounded-full px-3 py-2 text-[13px] font-medium text-white/58 transition active:bg-white/10"
              >
                다시 보지 않기
              </button>
              <button
                type="button"
                onClick={() => finish('next')}
                className="ml-auto rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#7B6EE8] shadow-[0_4px_14px_rgba(123,110,232,0.28)] transition active:scale-[0.98]"
              >
                다음
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
