/** 백엔드 API 베이스 URL (끝 슬래시 없음). Netlify 프론트 URL이 아님. */
export function getBackendBaseUrl(): string {
  const raw =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';
  return raw.replace(/\/$/, '');
}

/** 카카오 로그인 시작 — 반드시 백엔드 호스트로 이동 */
export function getKakaoOAuthLoginUrl(): string {
  const base = getBackendBaseUrl();
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  if (
    typeof window !== 'undefined' &&
    base.replace(/\/$/, '') === window.location.origin
  ) {
    throw new Error(
      'VITE_API_BASE_URL must be the backend HTTPS URL (e.g. trycloudflare.com), not the Netlify site URL.',
    );
  }
  return `${base}/oauth/kakao/login`;
}
