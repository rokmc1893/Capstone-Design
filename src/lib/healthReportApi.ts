import type { InspectionArchiveResponse } from './inspectionArchive';
import type { HealthRecord, HealthComparisonRow, HealthComparisonStatus } from '../types/healthReport';
import type { ResultReport, ResultComparisonRow, ResultQuestionnaireGroup } from '../types/resultReport';

function trendToStatus(t: ResultComparisonRow['trend']): HealthComparisonStatus {
  if (t === 'neutral') return 'Normal';
  if (t === 'lower') return 'Low';
  return 'High';
}

function parsePssFromReport(report: ResultReport): number | null {
  const fromCondition = report.condition.stressLabel.match(/PSS\s*(\d+)/i);
  if (fromCondition) return parseInt(fromCondition[1], 10);

  for (const group of report.questionnaireGroups ?? []) {
    for (const row of group.rows) {
      if (!/(PSS|스트레스)/i.test(row.label)) continue;
      const hit = row.value.match(/(\d+)/);
      if (hit) return parseInt(hit[1], 10);
    }
  }
  return null;
}

function parseMetricMap(groups: ResultQuestionnaireGroup[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const g of groups) {
    for (const row of g.rows) {
      m.set(row.label, row.value);
    }
  }
  return m;
}

function parseNumberFromLabel(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}

/** `ResultReport`(백엔드 `GET /api/results/{id}` + 클라이언트 enrich) → 화면용 `HealthRecord` */
export function healthRecordFromResultReport(
  report: ResultReport,
  meta: { year: number; month: number; week: number; date: string; id: string },
): HealthRecord {
  const groups = report.questionnaireGroups ?? [];
  const map = parseMetricMap(groups);

  const gender: HealthRecord['gender'] = report.gender === '남성' ? 'male' : 'female';

  /**
   * 백엔드 `questionnaireGroups` 고정 라벨 (운영 계약):
   *   - 신체: 나이 / 키 / 몸무게
   *   - 생활습관: 흡연 / 음주 / 폭음 / 수면
   * 그 외 라벨(초경 나이, 임신/출산, 성관계 여부 등)은 클라이언트가
   * `enrichReportFromSimulator`로 보강한 경우에만 존재합니다.
   */
  const inputData: HealthRecord['inputData'] = {
    age: map.get('나이') ? parseNumberFromLabel(map.get('나이')) : report.age > 0 ? report.age : null,
    height: parseNumberFromLabel(map.get('키')),
    weight: parseNumberFromLabel(map.get('몸무게')),
    smoking: map.get('흡연') ?? '—',
    drinking:
      map.get('음주') ??
      map.get('음주 빈도') ??
      map.get('음주(폭음 일수)') ??
      map.get('폭음') ??
      map.get('폭음 빈도') ??
      '—',
    sleep: map.get('수면') ?? map.get('수면 시간') ?? report.condition.sleepLabel,
    sexualActivity: map.get('성관계 여부(12개월)') ?? map.get('성관계 여부'),
    firstPeriodAge:
      map.get('초경 나이') ? (parseNumberFromLabel(map.get('초경 나이')) ?? undefined) : undefined,
    pregnancyExperience: map.get('임신/출산 경험') ?? map.get('임신/출산'),
  };

  const comparisonTable: HealthComparisonRow[] = (report.comparisonTable ?? []).map((row) => ({
    label: row.item,
    myValue: row.myValue,
    avgValue: row.averageValue,
    result: row.comparisonResult,
    status: trendToStatus(row.trend),
  }));

  return {
    id: meta.id,
    resultId: report.resultId,
    date: meta.date,
    year: meta.year,
    month: meta.month,
    week: meta.week,
    score: report.score,
    pssScore: parsePssFromReport(report),
    gender,
    inputData,
    questionnaireGroups: groups,
    comparisonTable,
    risks: report.coreRiskBullets ?? [],
    aiNarrative: report.personalizedAnalysis ?? '',
    guides: report.actionGuideBullets ?? [],
    factorCards: (report.factorAnalyses ?? []).map((fa) => ({
      factor: fa.factor,
      insight: fa.mateThought,
      expectedChange: fa.expectedChange,
    })),
    missionPreviews: (report.missions ?? []).map((m) => ({
      title: m.title,
      description: m.description,
    })),
  };
}

export function parseWeekFromRoundLabel(label: string): number {
  const m = label.match(/(\d+)\s*주차/);
  return m ? parseInt(m[1], 10) : 1;
}

export function findRoundMetaForResultId(
  archive: InspectionArchiveResponse,
  resultId: number,
): { year: number; month: number; week: number; date: string; id: string } | null {
  for (const y of archive.years) {
    for (const mo of y.months) {
      for (const round of mo.rounds) {
        if (round.resultId === resultId) {
          const week = parseWeekFromRoundLabel(round.label);
          const date = round.inspectedAt.slice(0, 10);
          return { year: y.year, month: mo.month, week, date, id: round.id };
        }
      }
    }
  }
  return null;
}
