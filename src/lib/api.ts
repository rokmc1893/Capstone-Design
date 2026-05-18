/**
 * 공통 API 클라이언트
 * - baseURL: VITE_API_BASE_URL (.env.local)
 * - JWT Bearer 토큰 자동 첨부
 * - 401 응답 시 refreshToken으로 자동 재발급 후 재시도 (1회)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/** 공통 응답 envelope */
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
}

/** 로그인/회원가입 응답의 user 객체 */
export interface AuthUser {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  isTermsAgreed: boolean;
}

/** 로그인/회원가입 result */
export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

/** 재발급 대기 큐 처리 */
function flushQueue(token: string | null, error: unknown) {
  pendingQueue.forEach((p) => (token ? p.resolve(token) : p.reject(error)));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const raw = localStorage.getItem('auth-state');
  const refreshToken: string | null = raw
    ? (JSON.parse(raw)?.state?.refreshToken ?? null)
    : null;

  if (!refreshToken) throw new ApiError('NO_TOKEN', '리프레시 토큰 없음', 401);

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  const json: ApiResponse<{ accessToken: string }> = await res.json();

  if (!json.isSuccess || !json.result?.accessToken) {
    throw new ApiError(json.code, json.message, res.status);
  }

  // zustand persist 스토어에 새 토큰 반영
  const stored = JSON.parse(localStorage.getItem('auth-state') ?? '{}');
  stored.state = { ...(stored.state ?? {}), accessToken: json.result.accessToken };
  localStorage.setItem('auth-state', JSON.stringify(stored));

  return json.result.accessToken;
}

function getAccessToken(): string | null {
  const raw = localStorage.getItem('auth-state');
  return raw ? (JSON.parse(raw)?.state?.accessToken ?? null) : null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 401 → 자동 토큰 재발급 후 재시도
  if (res.status === 401 && retry) {
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            resolve(
              request<T>(path, { ...options, headers }, false),
            );
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      flushQueue(newToken, null);
      headers['Authorization'] = `Bearer ${newToken}`;
      return request<T>(path, { ...options, headers }, false);
    } catch (err) {
      isRefreshing = false;
      flushQueue(null, err);
      // 재발급 실패 → 로그인 화면으로
      window.location.href = '/login';
      throw err;
    }
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.isSuccess) {
    throw new ApiError(json.code, json.message, res.status);
  }
  return json.result as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
