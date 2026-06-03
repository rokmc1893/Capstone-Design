/** 백엔드 API 베이스 URL (끝 슬래시 없음). Netlify 프론트 URL이 아님. */
export function getBackendBaseUrl(): string {
  const raw =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';
  return raw.replace(/\/$/, '');
}

/** 카카오 로그인 시작 URL */
export function getKakaoOAuthLoginUrl(): string {
  const base = getBackendBaseUrl();
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (!base || base === origin) {
      return `${origin}/oauth/kakao/login`;
    }
  }
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  return `${base}/oauth/kakao/login`;
}
