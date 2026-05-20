import type { HomeRecentTestDto } from '../types/backendApi';
import type { ResultRiskLevel } from '../types/resultReport';

export type HomeSummary = {
  resultId: number | null;
  score: number | null;
  riskLevel: ResultRiskLevel | null;
  topFactors: string[];
};

function normalizeRiskLevel(raw: string | undefined): ResultRiskLevel | null {
  if (!raw) return null;
  const u = raw.trim().toUpperCase();
  if (u === 'SAFE') return 'SAFE';
  if (u === 'WARNING') return 'WARNING';
  if (u === 'DANGER') return 'DANGER';
  return null;
}

/** `GET /home`의 `recentTest` → 홈 요약 카드 데이터 */
export function homeSummaryFromRecentTest(
  recent: HomeRecentTestDto | null | undefined,
): HomeSummary | null {
  if (!recent || recent.resultId == null || recent.resultId <= 0) return null;
  return {
    resultId: recent.resultId,
    score: typeof recent.score === 'number' ? recent.score : null,
    riskLevel: normalizeRiskLevel(recent.riskLevel),
    topFactors: Array.isArray(recent.topFactors) ? recent.topFactors : [],
  };
}
