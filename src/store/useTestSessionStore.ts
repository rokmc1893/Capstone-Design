import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TestSessionState = {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  clearSession: () => void;
};

export const useTestSessionStore = create<TestSessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      setSessionId: (sessionId) => set({ sessionId }),
      clearSession: () => set({ sessionId: null }),
    }),
    {
      name: 'test-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ sessionId: s.sessionId }),
    },
  ),
);
