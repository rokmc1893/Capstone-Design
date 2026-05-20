import type { NavigateFunction } from 'react-router-dom';
import type { TestSessionSubmitResult } from '../types/backendApi';

/** `GET /inspection-reports/detail?resultId=` */
export function inspectionReportDetailPath(resultId: number): string {
  return `/inspection-reports/detail?resultId=${resultId}`;
}

export function isValidResultId(id: unknown): id is number {
  return typeof id === 'number' && Number.isFinite(id) && id > 0;
}

/** POST `/tests/{id}/submit` 응답에서 resultId 추출 */
export function parseSubmitResultId(raw: unknown): number | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;

  if (isValidResultId(o.resultId)) return o.resultId;

  const nested = o.result;
  if (nested && typeof nested === 'object') {
    const r = nested as Record<string, unknown>;
    const id = r.resultId ?? r.id;
    if (isValidResultId(id)) return id;
    if (typeof id === 'string') {
      const parsed = Number.parseInt(id, 10);
      if (isValidResultId(parsed)) return parsed;
    }
  }

  return null;
}

/** 제출 직후 결과 상세로 이동 (resultId 없으면 보관함) */
export function navigateAfterTestSubmit(
  navigate: NavigateFunction,
  submitResult: TestSessionSubmitResult | unknown,
): void {
  const resultId = parseSubmitResultId(submitResult);
  if (resultId != null) {
    navigate(inspectionReportDetailPath(resultId));
    return;
  }
  navigate('/inspection-reports/archive');
}
