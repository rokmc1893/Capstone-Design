import { useAuthStore } from '../store/useAuthStore';

let redirectingToLogin = false;

/** 토큰 만료·재발급 실패 시 저장된 인증 정보를 지우고 로그인으로 이동 (홈↔로그인 깜빡임 방지) */
export function forceLogoutToLogin(): void {
  if (typeof window === 'undefined') return;

  useAuthStore.getState().logout();

  const path = window.location.pathname;
  if (path === '/login' || path.startsWith('/oauth/')) {
    redirectingToLogin = false;
    return;
  }

  if (redirectingToLogin) return;
  redirectingToLogin = true;
  window.location.replace('/login');
}
