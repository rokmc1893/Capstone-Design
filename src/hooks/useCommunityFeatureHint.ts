import { useCallback, useEffect, useRef, useState } from 'react';
import { useCommunityGuideStore } from '../store/useCommunityGuideStore';
import type { CommunityHintKey } from '../types/community';

const SPOTLIGHT_PAD = 10;

function measureAnchor(el: HTMLElement | null): DOMRect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return new DOMRect(
    r.left - SPOTLIGHT_PAD,
    r.top - SPOTLIGHT_PAD,
    r.width + SPOTLIGHT_PAD * 2,
    r.height + SPOTLIGHT_PAD * 2,
  );
}

/**
 * 기능 첫 사용 시 가이드 표시 후 액션 실행.
 * 가이드가 필요 없으면 즉시 action 실행.
 */
export function useCommunityFeatureHint() {
  const shouldShowHint = useCommunityGuideStore((s) => s.shouldShowHint);
  const [activeHint, setActiveHint] = useState<CommunityHintKey | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  const runWithHint = useCallback(
    (key: CommunityHintKey, action: () => void, anchor?: HTMLElement | null) => {
      if (!shouldShowHint(key)) {
        action();
        return;
      }
      anchorRef.current = anchor ?? null;
      setAnchorRect(measureAnchor(anchor ?? null));
      pendingRef.current = action;
      setActiveHint(key);
    },
    [shouldShowHint],
  );

  useEffect(() => {
    if (!activeHint) return;

    const update = () => setAnchorRect(measureAnchor(anchorRef.current));

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [activeHint]);

  const closeHint = useCallback(() => {
    setActiveHint(null);
    setAnchorRect(null);
    anchorRef.current = null;
    pendingRef.current = null;
  }, []);

  const completeHint = useCallback(() => {
    const action = pendingRef.current;
    pendingRef.current = null;
    setActiveHint(null);
    setAnchorRect(null);
    anchorRef.current = null;
    action?.();
  }, []);

  return {
    activeHint,
    anchorRect,
    runWithHint,
    closeHint,
    completeHint,
  };
}
