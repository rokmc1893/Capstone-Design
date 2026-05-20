import { fetchResultsHistoryRaw } from './homeMissionsApi';
import { homeSummaryFromRecentTest, type HomeSummary } from './homeSummary';
import { extractHistoryItems } from './resultsHistoryMapper';
import type { HomeDashboardDto, HomeRecentTestDto } from '../types/backendApi';
import type { ResultRiskLevel } from '../types/resultReport';

function normalizeRiskLevel(raw: string | undefined): ResultRiskLevel | null {
  if (!raw) return null;
  const u = raw.trim().toUpperCase();
  if (u === 'SAFE') return 'SAFE';
  if (u === 'WARNING') return 'WARNING';
  if (u === 'DANGER') return 'DANGER';
  return null;
}

function summaryFromHistoryItem(item: {
  resultId?: number;
  id?: number;
  aiScore?: number;
  score?: number;
  riskScore?: number;
  riskLevel?: string;
  topFactors?: string[];
}): HomeSummary | null {
  const resultId = item.resultId ?? item.id;
  if (resultId == null || !Number.isFinite(resultId) || resultId <= 0) return null;
  const score =
    typeof item.aiScore === 'number'
      ? item.aiScore
      : typeof item.score === 'number'
        ? item.score
        : typeof item.riskScore === 'number'
          ? item.riskScore
          : null;
  return {
    resultId,
    score,
    riskLevel: normalizeRiskLevel(item.riskLevel),
    topFactors: Array.isArray(item.topFactors) ? item.topFactors : [],
  };
}

async function latestFromResultsHistory(): Promise<HomeSummary | null> {
  try {
    const raw = await fetchResultsHistoryRaw();
    const items = extractHistoryItems(raw);
    if (items.length > 0) {
      return summaryFromHistoryItem(items[0]);
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** 이미 받은 `GET /home` 응답에서 요약 추출 (중복 호출 방지) */
export function homeSummaryFromDashboard(
  home: HomeDashboardDto | null | undefined,
): HomeSummary | null {
  return homeSummaryFromRecentTest(home?.recentTest as HomeRecentTestDto | undefined);
}

/** 홈 요약: recentTest 우선 → 없으면 `GET /results/history` fallback */
export async function fetchHomeSummaryWithFallback(
  home: HomeDashboardDto | null | undefined,
): Promise<HomeSummary | null> {
  if (!import.meta.env.VITE_API_BASE_URL) return null;

  const fromHome = homeSummaryFromDashboard(home);
  if (fromHome) return fromHome;

  return latestFromResultsHistory();
}
