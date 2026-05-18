import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../lib/api';

export type LoginMethod = 'kakao' | 'email';

interface AuthState {
  /** 로그인 방식 */
  loginMethod: LoginMethod;
  /** 이메일 로그인 시 계정 이메일 */
  email: string | null;
  /** JWT Access Token */
  accessToken: string | null;
  /** JWT Refresh Token */
  refreshToken: string | null;
  /** 로그인된 사용자 정보 */
  user: AuthUser | null;

  /** 로그인/회원가입 성공 후 호출 */
  setAuth: (payload: {
    method: LoginMethod;
    email?: string | null;
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;

  /** accessToken만 갱신 (리프레시 후) */
  setAccessToken: (token: string) => void;

  /** 로그인 사용자 정보 일부 갱신 (`GET/PATCH /users/me` 동기화) */
  updateUserProfile: (patch: Partial<AuthUser>) => void;

  /** 로그아웃 — 모든 인증 상태 초기화 */
  logout: () => void;
}

const INITIAL: Pick<
  AuthState,
  'loginMethod' | 'email' | 'accessToken' | 'refreshToken' | 'user'
> = {
  loginMethod: 'kakao',
  email: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...INITIAL,

      setAuth: ({ method, email = null, accessToken, refreshToken, user }) =>
        set({ loginMethod: method, email, accessToken, refreshToken, user }),

      setAccessToken: (accessToken) => set({ accessToken }),

      updateUserProfile: (patch) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...patch } : s.user,
        })),

      logout: () => set({ ...INITIAL }),
    }),
    {
      name: 'auth-state',
    },
  ),
);
