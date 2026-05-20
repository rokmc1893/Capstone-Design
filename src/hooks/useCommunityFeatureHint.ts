import { useCallback, useRef, useState } from 'react';
import { useCommunityGuideStore } from '../store/useCommunityGuideStore';
import type { CommunityHintKey } from '../types/community';

/**
 * 기능 첫 사용 시 가이드 표시 후 액션 실행.
 * 가이드가 필요 없으면 즉시 action 실행.
 */
export function useCommunityFeatureHint() {
  const shouldShowHint = useCommunityGuideStore((s) => s.shouldShowHint);
  const [activeHint, setActiveHint] = useState<CommunityHintKey | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  const runWithHint = useCallback(
    (key: CommunityHintKey, action: () => void) => {
      if (!shouldShowHint(key)) {
        action();
        return;
      }
      pendingRef.current = action;
      setActiveHint(key);
    },
    [shouldShowHint],
  );

  const closeHint = useCallback(() => {
    setActiveHint(null);
    pendingRef.current = null;
  }, []);

  const completeHint = useCallback(() => {
    const action = pendingRef.current;
    pendingRef.current = null;
    setActiveHint(null);
    action?.();
  }, []);

  return {
    activeHint,
    runWithHint,
    closeHint,
    completeHint,
  };
}
