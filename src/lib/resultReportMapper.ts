import type {
  ResultComparisonRow,
  ResultFactorAnalysis,
  ResultMission,
  ResultQuestionnaireGroup,
  ResultReport,
  ResultReportCondition,
  ResultReportIntro,
  ResultRiskLevel,
} from '../types/resultReport';

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function shallowCamelKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[snakeToCamelKey(k)] = v;
  }
  return out;
}

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function unwrapDetailPayload(raw: unknown): Record<string, unknown> | null {
  const top = asRecord(raw);
  if (!top) return null;
  const inner = top.result ?? top.data ?? top.content;
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return top;
}

function normalizeRiskLevel(raw: unknown): ResultRiskLevel {
  if (typeof raw !== 'string') return 'WARNING';
  const u = raw.trim().toUpperCase();
  if (u === 'SAFE') return 'SAFE';
  if (u === 'DANGER') return 'DANGER';
  return 'WARNING';
}

function formatResultGender(raw: unknown): '남성' | '여성' {
  if (typeof raw !== 'string') return '남성';
  const g = raw.trim();
  if (g === '남성' || g === '여성') return g;
  const u = g.toUpperCase();
  if (u === 'F' || u === 'FEMALE') return '여성';
  if (u === 'M' || u === 'MALE') return '남성';
  return '남성';
}

function normalizeIntro(raw: unknown): ResultReportIntro {
  const o = asRecord(raw);
  if (!o) {
    return { greeting: '', scoreMessage: '', comfortMessage: '' };
  }
  const c = shallowCamelKeys(o);
  return {
    greeting: String(c.greeting ?? ''),
    scoreMessage: String(c.scoreMessage ?? ''),
    comfortMessage: String(c.comfortMessage ?? ''),
  };
}

function normalizeCondition(raw: unknown): ResultReportCondition {
  const o = asRecord(raw);
  if (!o) {
    return { sleepLabel: '', stressLabel: '', summary: '' };
  }
  const c = shallowCamelKeys(o);
  return {
    sleepLabel: String(c.sleepLabel ?? ''),
    stressLabel: String(c.stressLabel ?? ''),
    summary: String(c.summary ?? ''),
  };
}

function normalizeFactorAnalyses(raw: unknown): ResultFactorAnalysis[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const o = asRecord(item);
      if (!o) return null;
      const c = shallowCamelKeys(o);
      const factor = String(c.factor ?? '').trim();
      if (!factor) return null;
      return {
        factor,
        category: (c.category as ResultFactorAnalysis['category']) ?? 'OTHER',
        mateThought: String(c.mateThought ?? ''),
        expectedChange: String(c.expectedChange ?? ''),
      };
    })
    .filter((x): x is ResultFactorAnalysis => x != null);
}

function normalizeMissions(raw: unknown): ResultMission[] {
  if (!Array.isArray(raw)) return [];
  const out: ResultMission[] = [];
  for (const item of raw) {
    const o = asRecord(item);
    if (!o) continue;
    const c = shallowCamelKeys(o);
    const title = String(c.title ?? '').trim();
    if (!title) continue;
    const freq = asRecord(c.frequency);
    const dur = asRecord(c.duration);
    out.push({
      title,
      description: String(c.description ?? ''),
      linkedFactor: String(c.linkedFactor ?? ''),
      category: (c.category as ResultMission['category']) ?? 'OTHER',
      frequency: {
        type: freq?.type === 'WEEKLY' ? 'WEEKLY' : 'DAILY',
        count: typeof freq?.count === 'number' ? freq.count : 1,
        unit: String(freq?.unit ?? '회'),
      },
      duration: {
        value: typeof dur?.value === 'number' ? dur.value : undefined,
        unit: dur?.unit != null ? String(dur.unit) : undefined,
      },
      difficulty: (c.difficulty as ResultMission['difficulty']) ?? 'EASY',
      userAdjustable: Boolean(c.userAdjustable),
    });
  }
  return out;
}

function normalizeQuestionnaireGroups(raw: unknown): ResultQuestionnaireGroup[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const groups: ResultQuestionnaireGroup[] = [];
  for (const item of raw) {
    const o = asRecord(item);
    if (!o) continue;
    const c = shallowCamelKeys(o);
    const title = String(c.title ?? '').trim();
    const rowsRaw = c.rows;
    if (!title || !Array.isArray(rowsRaw)) continue;
    const rows = rowsRaw
      .map((row) => {
        const r = asRecord(row);
        if (!r) return null;
        const rc = shallowCamelKeys(r);
        const label = String(rc.label ?? '').trim();
        const value = String(rc.value ?? '').trim();
        if (!label) return null;
        return { label, value };
      })
      .filter((x): x is { label: string; value: string } => x != null);
    if (rows.length > 0) groups.push({ title, rows });
  }
  return groups.length > 0 ? groups : undefined;
}

function normalizeComparisonTable(raw: unknown): ResultComparisonRow[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const rows: ResultComparisonRow[] = [];
  for (const item of raw) {
    const o = asRecord(item);
    if (!o) continue;
    const c = shallowCamelKeys(o);
    const itemLabel = String(c.item ?? '').trim();
    if (!itemLabel) continue;
    const trendRaw = String(c.trend ?? 'neutral').toLowerCase();
    const trend: ResultComparisonRow['trend'] =
      trendRaw === 'higher' || trendRaw === 'lower' ? trendRaw : 'neutral';
    rows.push({
      item: itemLabel,
      myValue: String(c.myValue ?? '—'),
      averageValue: String(c.averageValue ?? '—'),
      comparisonResult: String(c.comparisonResult ?? ''),
      trend,
    });
  }
  return rows.length > 0 ? rows : undefined;
}

function buildPersonalizedAnalysis(report: Pick<ResultReport, 'intro' | 'condition' | 'closing'>): string {
  const parts = [
    report.intro.greeting,
    report.intro.scoreMessage,
    report.intro.comfortMessage,
    report.condition.summary,
    report.closing,
  ]
    .map((s) => s?.trim())
    .filter(Boolean);
  return parts.join('\n\n');
}

function buildCoreRiskBullets(factorAnalyses: ResultFactorAnalysis[]): string[] {
  const bullets = factorAnalyses
    .map((f) => f.factor.trim())
    .filter(Boolean);
  return bullets.length > 0 ? bullets : [];
}

function buildActionGuideBullets(missions: ResultMission[]): string[] {
  const lines = missions.map((m) => (m.description || m.title).trim()).filter(Boolean);
  const uniq: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    if (seen.has(line)) continue;
    seen.add(line);
    uniq.push(line);
  }
  return uniq;
}

/** `GET /api/results/{id}` (`DetailReport`) → 프론트 `ResultReport` */
export function normalizeDetailReport(raw: unknown): ResultReport | null {
  const payload = unwrapDetailPayload(raw);
  if (!payload) return null;
  const c = shallowCamelKeys(payload);

  const resultId = typeof c.resultId === 'number' ? c.resultId : Number(c.resultId);
  if (!Number.isFinite(resultId) || resultId <= 0) return null;

  const intro = normalizeIntro(c.intro);
  const condition = normalizeCondition(c.condition);
  const factorAnalyses = normalizeFactorAnalyses(c.factorAnalyses);
  const missions = normalizeMissions(c.missions);

  const report: ResultReport = {
    resultId,
    nickname: String(c.nickname ?? '회원'),
    age: typeof c.age === 'number' ? c.age : Number(c.age) || 0,
    gender: formatResultGender(c.gender),
    score: typeof c.score === 'number' ? c.score : Number(c.score) || 0,
    riskLevel: normalizeRiskLevel(c.riskLevel),
    intro,
    condition,
    factorAnalyses,
    missions,
    closing: String(c.closing ?? ''),
    questionnaireGroups: normalizeQuestionnaireGroups(c.questionnaireGroups),
    comparisonTable: normalizeComparisonTable(c.comparisonTable),
    personalizedAnalysis:
      typeof c.personalizedAnalysis === 'string' ? c.personalizedAnalysis : undefined,
    actionGuideBullets: Array.isArray(c.actionGuideBullets)
      ? (c.actionGuideBullets as unknown[]).map(String).filter(Boolean)
      : undefined,
    coreRiskBullets: Array.isArray(c.coreRiskBullets)
      ? (c.coreRiskBullets as unknown[]).map(String).filter(Boolean)
      : undefined,
    topFactors: Array.isArray(c.topFactors)
      ? (c.topFactors as unknown[])
          .map((f) => {
            if (typeof f === 'string') return { label: f, value: 0 };
            const o = asRecord(f);
            if (!o) return null;
            const fc = shallowCamelKeys(o);
            const label = String(fc.label ?? fc.name ?? '').trim();
            if (!label) return null;
            const value = typeof fc.value === 'number' ? fc.value : Number(fc.value) || 0;
            return { label, value };
          })
          .filter((x): x is { label: string; value: number } => x != null)
      : undefined,
  };

  return enrichReportFromApi(report);
}

/** API 응답 전용 — 시뮬레이터 스냅샷으로 설문·비교표를 덮어쓰지 않음 */
export function enrichReportFromApi(report: ResultReport): ResultReport {
  const coreRiskBullets =
    report.coreRiskBullets && report.coreRiskBullets.length > 0
      ? report.coreRiskBullets
      : buildCoreRiskBullets(report.factorAnalyses);

  const personalizedAnalysis =
    report.personalizedAnalysis?.trim() || buildPersonalizedAnalysis(report);

  const actionGuideBullets =
    report.actionGuideBullets && report.actionGuideBullets.length > 0
      ? report.actionGuideBullets
      : buildActionGuideBullets(report.missions);

  return {
    ...report,
    coreRiskBullets,
    personalizedAnalysis,
    actionGuideBullets,
  };
}
