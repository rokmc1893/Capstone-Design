import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LoginMethod = 'kakao' | 'email';

interface AuthState {
  loginMethod: LoginMethod;
  email: string | null;
  setLoginMethod: (method: LoginMethod, email?: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loginMethod: 'kakao',
      email: null,
      setLoginMethod: (method, email = null) => set({ loginMethod: method, email }),
      reset: () => set({ loginMethod: 'kakao', email: null }),
    }),
    {
      name: 'auth-state',
    },
  ),
);

