import { useEffect, useState } from 'react';
import { getTestSession } from '../lib/testsSessionApi';
import { restoreInspectionDraftFromSession } from '../lib/testsSessionRestore';
import { useTestSessionStore } from '../store/useTestSessionStore';

let restoredSessionId: string | null = null;

/**
 * 새로고침 후 `sessionId`만 남아 있어도 서버 세션값으로 검사 초안을 복구합니다.
 * 같은 탭에서 이미 복구한 세션은 중복 호출하지 않습니다.
 */
export function useRestoreInspectionSession(expectedGender?: 'male' | 'female') {
  const sessionId = useTestSessionStore((s) => s.sessionId);
  const [ready, setReady] = useState(!import.meta.env.VITE_API_BASE_URL || !sessionId);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base || !sessionId) {
      setReady(true);
      return;
    }
    if (restoredSessionId === sessionId) {
      setReady(true);
      return;
    }

    let active = true;
    setReady(false);

    void getTestSession(sessionId)
      .then((raw) => {
        if (!active) return;
        restoreInspectionDraftFromSession(raw, expectedGender);
        restoredSessionId = sessionId;
      })
      .catch(() => {
        if (!active) return;
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [expectedGender, sessionId]);

  return ready;
}
