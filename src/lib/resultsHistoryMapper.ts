import type { InspectionArchiveResponse, InspectionMonth, InspectionRound, InspectionYear } from './inspectionArchive';

type HistoryItemLike = {
  resultId?: number;
  id?: number;
  inspectedAt?: string;
  testedAt?: string;
  createdAt?: string;
  aiScore?: number;
  score?: number;
  riskScore?: number;
  riskLevel?: string;
  riskLabel?: string;
  statusLabel?: string;
};

function riskLevelToStatusLabel(riskLevel: string | undefined, score: number): string {
  if (riskLevel === 'SAFE') return '양호';
  if (riskLevel === 'WARNING') return '주의';
  if (riskLevel === 'DANGER') return '고위험';
  return riskToLabel(score);
}

function extractItems(raw: unknown): HistoryItemLike[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as HistoryItemLike[];
  if (typeof raw !== 'object') return [];
  const o = raw as Record<string, unknown>;
  const inner = o.items ?? o.results ?? o.content ?? o.history ?? o.data;
  if (Array.isArray(inner)) return inner as HistoryItemLike[];
  const nested = o.result as Record<string, unknown> | undefined;
  if (nested) {
    const list = nested.items ?? nested.results ?? nested.content;
    if (Array.isArray(list)) return list as HistoryItemLike[];
  }
  return [];
}

function riskToLabel(score: number | undefined): string {
  if (score == null || Number.isNaN(score)) return '—';
  if (score < 30) return '양호';
  if (score < 60) return '주의';
  return '고위험';
}

function isoFromItem(it: HistoryItemLike): string {
  const s = it.inspectedAt ?? it.testedAt ?? it.createdAt ?? new Date().toISOString();
  return typeof s === 'string' ? s : new Date().toISOString();
}

function resultIdFromItem(it: HistoryItemLike): number {
  const id = it.resultId ?? it.id;
  return typeof id === 'number' && Number.isFinite(id) ? id : 0;
}

/** 검사 이력 API → 보관함 캘린더용 아카이브 트리 */
export function mapResultsHistoryToInspectionArchive(raw: unknown): InspectionArchiveResponse {
  const items = extractItems(raw);
  const sorted = [...items].sort(
    (a, b) => new Date(isoFromItem(b)).getTime() - new Date(isoFromItem(a)).getTime(),
  );

  const yearMap = new Map<number, Map<number, InspectionRound[]>>();

  for (const it of sorted) {
    const rid = resultIdFromItem(it);
    if (!rid) continue;
    const iso = isoFromItem(it);
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const score = it.aiScore ?? it.riskScore ?? it.score ?? 0;
    const statusLabel =
      it.statusLabel ?? it.riskLabel ?? riskLevelToStatusLabel(it.riskLevel, score);

    const round: InspectionRound = {
      id: `${year}-${String(month).padStart(2, '0')}-${rid}`,
      resultId: rid,
      label: `${month}월 검사`,
      inspectedAt: iso,
      riskScore: Math.round(score),
      statusLabel,
      metrics: [],
    };

    if (!yearMap.has(year)) yearMap.set(year, new Map());
    const moMap = yearMap.get(year)!;
    if (!moMap.has(month)) moMap.set(month, []);
    moMap.get(month)!.push(round);
  }

  const years: InspectionYear[] = [...yearMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, moMap]) => {
      const months: InspectionMonth[] = [...moMap.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([month, rounds]) => ({
          month,
          rounds: rounds.sort(
            (x, y) => new Date(y.inspectedAt).getTime() - new Date(x.inspectedAt).getTime(),
          ),
        }));
      return { year, months };
    });

  return { years };
}
