import { api } from './api';

export type InspectionMetric = {
  key: string;
  label: string;
  value: string;
};

export type InspectionRound = {
  id: string;
  resultId: number;
  label: string;
  inspectedAt: string;
  riskScore: number;
  statusLabel: string;
  metrics: InspectionMetric[];
};

export type InspectionMonth = {
  month: number;
  rounds: InspectionRound[];
};

export type InspectionYear = {
  year: number;
  months: InspectionMonth[];
};

export type InspectionArchiveResponse = {
  years: InspectionYear[];
};

const ARCHIVE_PATH = '/inspection-reports/archive';

function buildMockArchive(now: Date): InspectionArchiveResponse {
  const year = now.getFullYear();

  return {
    years: [
      {
        year,
        months: [
          {
            month: 2,
            rounds: [
              {
                id: `${year}-02-1`,
                resultId: 121,
                label: '2월 2주차 검사',
                inspectedAt: `${year}-02-12T10:30:00+09:00`,
                riskScore: 42,
                statusLabel: '주의',
                metrics: [
                  { key: 'gender', label: '성별', value: '여성' },
                  { key: 'age', label: '나이', value: '32세' },
                  { key: 'bmi', label: 'BMI', value: '23.4' },
                  { key: 'smoking', label: '흡연', value: '가끔' },
                  { key: 'alcohol', label: '음주', value: '가끔' },
                  { key: 'sleep', label: '수면 시간', value: '6시간' },
                  { key: 'stress', label: '스트레스', value: '5/10' },
                  { key: 'risk', label: '위험도 점수', value: '42점' },
                ],
              },
            ],
          },
          {
            month: 3,
            rounds: [
              {
                id: `${year}-03-1`,
                resultId: 122,
                label: '3월 1주차 검사',
                inspectedAt: `${year}-03-05T09:15:00+09:00`,
                riskScore: 38,
                statusLabel: '주의',
                metrics: [
                  { key: 'gender', label: '성별', value: '여성' },
                  { key: 'age', label: '나이', value: '32세' },
                  { key: 'bmi', label: 'BMI', value: '22.8' },
                  { key: 'smoking', label: '흡연', value: '없음' },
                  { key: 'alcohol', label: '음주', value: '가끔' },
                  { key: 'sleep', label: '수면 시간', value: '6.5시간' },
                  { key: 'stress', label: '스트레스', value: '4/10' },
                  { key: 'risk', label: '위험도 점수', value: '38점' },
                ],
              },
              {
                id: `${year}-03-4`,
                resultId: 123,
                label: '3월 4주차 검사',
                inspectedAt: `${year}-03-27T18:40:00+09:00`,
                riskScore: 31,
                statusLabel: '양호',
                metrics: [
                  { key: 'gender', label: '성별', value: '여성' },
                  { key: 'age', label: '나이', value: '32세' },
                  { key: 'bmi', label: 'BMI', value: '22.5' },
                  { key: 'smoking', label: '흡연', value: '없음' },
                  { key: 'alcohol', label: '음주', value: '없음' },
                  { key: 'sleep', label: '수면 시간', value: '7시간' },
                  { key: 'stress', label: '스트레스', value: '3/10' },
                  { key: 'risk', label: '위험도 점수', value: '31점' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export async function fetchInspectionArchive(): Promise<InspectionArchiveResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!baseUrl) {
    return buildMockArchive(new Date());
  }

  try {
    return await api.get<InspectionArchiveResponse>(ARCHIVE_PATH);
  } catch {
    return { years: [] };
  }
}

export function sortArchiveYears(years: InspectionYear[]): InspectionYear[] {
  return [...years].sort((a, b) => b.year - a.year);
}

export function getYearEntry(
  archive: InspectionArchiveResponse,
  year: number,
): InspectionYear | undefined {
  return archive.years.find((entry) => entry.year === year);
}

export function getMonthEntry(
  yearEntry: InspectionYear | undefined,
  month: number,
): InspectionMonth | undefined {
  return yearEntry?.months.find((entry) => entry.month === month);
}

export function getActiveMonths(yearEntry: InspectionYear | undefined): number[] {
  if (!yearEntry) return [];
  return [...yearEntry.months]
    .filter((entry) => entry.rounds.length > 0)
    .map((entry) => entry.month)
    .sort((a, b) => a - b);
}

export function getDefaultSelection(
  archive: InspectionArchiveResponse,
  now = new Date(),
): { year: number; month: number; roundId: string | null } {
  const sortedYears = sortArchiveYears(archive.years);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const yearEntry =
    sortedYears.find((entry) => entry.year === currentYear) ?? sortedYears[0];
  const year = yearEntry?.year ?? currentYear;
  const active = getActiveMonths(yearEntry);
  const month =
    active.includes(currentMonth) ? currentMonth : active.length > 0 ? active[active.length - 1] : currentMonth;
  const monthEntry = getMonthEntry(yearEntry, month);
  const roundId = monthEntry?.rounds[0]?.id ?? null;

  return { year, month, roundId };
}

/** 연도를 바꿀 때: 직전 월에 그 해 데이터가 있으면 유지, 없으면 이번 달(달력) 또는 그 해 첫 기록 월 */
export function pickMonthWhenYearChanges(
  yearEntry: InspectionYear | undefined,
  previousMonth: number,
  calendarMonth: number,
): number {
  const active = getActiveMonths(yearEntry);
  if (active.length === 0) return Math.min(12, Math.max(1, previousMonth));
  if (active.includes(previousMonth)) return previousMonth;
  if (active.includes(calendarMonth)) return calendarMonth;
  return active[0];
}

/** 해당 월 검사일(로컬 YYYY-MM-DD) 목록 — 중복 제거·정렬 */
export function distinctInspectionDatesInMonth(rounds: InspectionRound[]): string[] {
  const set = new Set<string>();
  for (const r of rounds) {
    const d = r.inspectedAt.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) set.add(d);
  }
  return [...set].sort();
}

export type MonthCalendarCell = {
  key: string;
  day: number | null;
  iso: string | null;
  hasInspection: boolean;
  isToday: boolean;
};

/** 선택한 연·월에 대한 달력 그리드(앞쪽 빈 칸 패딩 포함). `inspectionDateSet`에 있는 날은 검사 있음 */
export function buildMonthCalendarGrid(
  year: number,
  month: number,
  inspectionDateSet: Set<string>,
  today: Date = new Date(),
): MonthCalendarCell[] {
  const cells: MonthCalendarCell[] = [];
  const lastDay = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({
      key: `pad-${year}-${month}-${i}`,
      day: null,
      iso: null,
      hasInspection: false,
      isToday: false,
    });
  }

  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();

  for (let d = 1; d <= lastDay; d++) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      key: iso,
      day: d,
      iso,
      hasInspection: inspectionDateSet.has(iso),
      isToday: year === ty && month === tm && d === td,
    });
  }

  return cells;
}
