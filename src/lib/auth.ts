/**
 * 인증 관련 API 함수
 * - 회원가입, 로그인, 카카오 로그인, 토큰 재발급
 */

import { api, type AuthResult } from './api';
import { getKakaoOAuthLoginUrl } from './backendUrl';

/** 일반 회원가입 */
export async function signUp(payload: {
  email: string;
  password: string;
  nickname: string;
}): Promise<AuthResult> {
  return api.post<AuthResult>('/auth/signup', payload);
}

/** 일반 로그인 */
export async function emailLogin(payload: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  return api.post<AuthResult>('/auth/login', payload);
}

/** 카카오 로그인 — 백엔드 OAuth 엔드포인트로 전체 리다이렉트 */
export function redirectToKakaoLogin() {
  window.location.href = getKakaoOAuthLoginUrl();
}

/** 토큰 재발급 */
export async function refreshToken(refreshToken: string): Promise<string> {
  const result = await api.post<{ accessToken: string }>('/auth/refresh', {
    refreshToken,
  });
  return result.accessToken;
}
