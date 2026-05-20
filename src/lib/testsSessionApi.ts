import { api } from './api';
import type { TestSessionStartResult, TestSessionSubmitResult } from '../types/backendApi';
import { pssAnswersFromStore, toApiGender } from './testsSessionMappers';

export type ApiGender = 'M' | 'F';

export async function postTestsStart(gender: ApiGender): Promise<TestSessionStartResult> {
  const raw = await api.post<{ sessionId: number | string }>('/tests/start', { gender });
  return { sessionId: String(raw.sessionId) };
}

export async function postTestsStartFromUiGender(
  gender: 'male' | 'female',
): Promise<TestSessionStartResult> {
  return postTestsStart(toApiGender(gender));
}

export async function getTestSession(sessionId: string): Promise<unknown> {
  return api.get<unknown>(`/tests/${sessionId}`);
}

export async function patchTestSessionMaleStep(
  sessionId: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return api.patch<unknown>(`/tests/${sessionId}/step/male`, body);
}

export async function patchTestSessionFemaleStep(
  sessionId: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return api.patch<unknown>(`/tests/${sessionId}/step/female`, body);
}

export async function getTestInterimReport(sessionId: string): Promise<unknown> {
  return api.get<unknown>(`/tests/${sessionId}/interim-report`);
}

export async function postTestSubmit(
  sessionId: string,
  pssAnswers: number[],
): Promise<TestSessionSubmitResult> {
  return api.post<TestSessionSubmitResult>(`/tests/${sessionId}/submit`, {
    pssAnswers,
  });
}

export async function postTestSubmitFromStore(
  sessionId: string,
  storeAnswers: Array<number | null | undefined>,
): Promise<TestSessionSubmitResult> {
  return postTestSubmit(sessionId, pssAnswersFromStore(storeAnswers));
}
