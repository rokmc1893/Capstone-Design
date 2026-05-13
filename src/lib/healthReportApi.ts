import type { InspectionArchiveResponse } from './inspectionArchive';
import type { HealthRecord, HealthComparisonRow, HealthComparisonStatus } from '../types/healthReport';
import type { ResultReport, ResultComparisonRow, ResultQuestionnaireGroup } from '../types/resultReport';

function trendToStatus(t: ResultComparisonRow['trend']): HealthComparisonStatus {
  if (t === 'neutral') return 'Normal';
  if (t === 'lower') return 'Low';
  return 'High';
}

function parsePssFromReport(report: ResultReport): number {
  const m = report.condition.stressLabel.match(/PSS\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
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

function parseNumberFromLabel(v: string | undefined): number {
  if (!v) return 0;
  const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

/** `ResultReport`(백엔드 `GET /api/results/{id}` + 클라이언트 enrich) → 화면용 `HealthRecord` */
export function healthRecordFromResultReport(
  report: ResultReport,
  meta: { year: number; month: number; week: number; date: string; id: string },
): HealthRecord {
  const groups = report.questionnaireGroups ?? [];
  const map = parseMetricMap(groups);

  const gender: HealthRecord['gender'] = report.gender === '남성' ? 'male' : 'female';

  const inputData: HealthRecord['inputData'] = {
    age: map.get('나이') ? parseNumberFromLabel(map.get('나이')) : report.age,
    height: parseNumberFromLabel(map.get('키')),
    weight: parseNumberFromLabel(map.get('몸무게')),
    smoking: map.get('흡연') ?? '—',
    drinking:
      map.get('음주') ??
      map.get('음주(폭음 일수)') ??
      map.get('폭음 빈도') ??
      '—',
    sleep: map.get('수면') ?? map.get('수면 시간') ?? report.condition.sleepLabel,
    sexualActivity: map.get('성관계 여부(12개월)') ?? map.get('성관계 여부'),
    firstPeriodAge: map.get('초경 나이') ? parseNumberFromLabel(map.get('초경 나이')) : undefined,
    pregnancyExperience: map.get('임신/출산'),
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
    date: meta.date,
    year: meta.year,
    month: meta.month,
    week: meta.week,
    score: report.score,
    pssScore: parsePssFromReport(report),
    gender,
    inputData,
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
