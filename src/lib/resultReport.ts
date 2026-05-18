import { api } from './api';
import { fetchHomeDashboard, fetchResultsHistoryRaw } from './homeMissionsApi';
import { mapResultsHistoryToInspectionArchive } from './resultsHistoryMapper';
import { enrichReportFromSimulator, wellnessScoreFromRisk } from './inspectionReportDerived';
import { useSimulatorStore } from '../store/useSimulatorStore';
import type { SimulatorState } from '../store/useSimulatorStore';
import type { ResultReport, ResultRiskLevel } from '../types/resultReport';

const RESULT_PATH = '/api/results';

function formatGender(gender: SimulatorState['gender']): '남성' | '여성' {
  return gender === 'male' ? '남성' : '여성';
}

function toRiskLevel(risk: number): ResultRiskLevel {
  if (risk < 30) return 'SAFE';
  if (risk < 60) return 'WARNING';
  return 'DANGER';
}

function smokingFactorLabel(smoking: SimulatorState['smoking']): string | null {
  if (smoking === 'often') return '심한 흡연';
  if (smoking === 'sometimes') return '가끔 흡연';
  return null;
}

function drinkingFactorLabel(alcohol: SimulatorState['alcohol']): string | null {
  if (alcohol === 'often') return '잦은 음주';
  if (alcohol === 'sometimes') return '가끔 음주';
  return null;
}

function buildMockReport(
  resultId: number,
  nickname: string,
  snapshot: SimulatorState,
): ResultReport {
  const gender = formatGender(snapshot.gender);
  const riskRounded = Math.round(snapshot.risk);
  /** 백엔드 명세: `score`는 건강 점수(0~100). 로컬 목은 위험도로부터 환산 */
  const score = wellnessScoreFromRisk(riskRounded);
  const riskLevel = toRiskLevel(snapshot.risk);
  const factorAnalyses: ResultReport['factorAnalyses'] = [];

  const smokingFactor = smokingFactorLabel(snapshot.smoking);
  if (smokingFactor) {
    factorAnalyses.push({
      factor: smokingFactor,
      category: 'SMOKING',
      mateThought:
        '흡연은 생식 건강에 직접적인 영향을 미쳐요. 지금의 습관을 줄이면 회복에 도움이 될 수 있어요.',
      expectedChange: '완전 금연 시 정자 품질 회복에 큰 도움이 됩니다.',
    });
  }

  const drinkingFactor = drinkingFactorLabel(snapshot.alcohol);
  if (drinkingFactor) {
    factorAnalyses.push({
      factor: drinkingFactor,
      category: 'DRINKING',
      mateThought:
        '잦은 음주는 호르몬 균형과 회복 리듬을 흐트러뜨릴 수 있어요. 음주 빈도를 줄이는 것부터 시작해 보세요.',
      expectedChange: '음주 빈도를 줄이면 수면과 컨디션 회복이 더 수월해질 수 있어요.',
    });
  }

  if (snapshot.sleepHours < 7) {
    factorAnalyses.push({
      factor: '수면 부족',
      category: 'SLEEP',
      mateThought:
        '수면 시간이 부족하면 몸과 마음이 충분히 회복되지 못할 수 있어요. 규칙적인 수면 루틴이 도움이 됩니다.',
      expectedChange: '수면 시간을 조금씩 늘리면 컨디션과 집중력이 함께 좋아질 수 있어요.',
    });
  }

  const missions: ResultReport['missions'] = [];

  if (smokingFactor) {
    missions.push({
      title: '흡연 욕구가 들 때 물 한 컵 마시기',
      description:
        '흡연 욕구가 올라오면 즉시 물 한 컵을 마시며 5분간 호흡을 가다듬어 보세요.',
      linkedFactor: smokingFactor,
      category: 'SMOKING',
      frequency: { type: 'DAILY', count: 3, unit: '회' },
      duration: { value: 5, unit: '분' },
      difficulty: 'EASY',
      userAdjustable: true,
    });
  }

  if (drinkingFactor) {
    missions.push({
      title: '음주 대신 카페인 없는 차 마시기',
      description: '음주가 끌리는 시간에 따뜻한 차를 마시며 긴장을 풀어 보세요.',
      linkedFactor: drinkingFactor,
      category: 'DRINKING',
      frequency: { type: 'WEEKLY', count: 2, unit: '회' },
      duration: { value: 10, unit: '분' },
      difficulty: 'MEDIUM',
      userAdjustable: true,
    });
  }

  if (snapshot.sleepHours < 7) {
    missions.push({
      title: '취침 30분 전 스크린 끄기',
      description: '잠들기 전 30분 동안 휴대폰과 TV를 멀리해 수면 준비 시간을 만들어 보세요.',
      linkedFactor: '수면 부족',
      category: 'SLEEP',
      frequency: { type: 'DAILY', count: 1, unit: '회' },
      duration: { value: 30, unit: '분' },
      difficulty: 'EASY',
      userAdjustable: true,
    });
  }

  const sleepLabel =
    snapshot.sleepHours < 6
      ? `다소 부족한 수면 (${snapshot.sleepHours}시간)`
      : snapshot.sleepHours < 7
        ? `조금 부족한 수면 (${snapshot.sleepHours}시간)`
        : `충분한 수면 (${snapshot.sleepHours}시간)`;

  const stressLabel =
    snapshot.pssSum > 0
      ? `PSS ${snapshot.pssSum}점/40점`
      : `보통 (${snapshot.stressLevel}/10)`;

  const base: ResultReport = {
    resultId,
    nickname,
    age: snapshot.age,
    gender,
    score,
    riskLevel,
    intro: {
      greeting: `안녕하세요, ${nickname}님!`,
      scoreMessage: `현재 ${nickname}님의 건강 점수는 ${score}점이에요.`,
      comfortMessage:
        riskLevel === 'SAFE'
          ? '지금은 비교적 안정적인 상태예요. 지금의 루틴을 꾸준히 이어가 보세요.'
          : '조금 신경 쓰이는 부분이 있지만, 함께 천천히 개선해 봐요.',
    },
    condition: {
      sleepLabel,
      stressLabel,
      summary:
        snapshot.sleepHours < 7 || snapshot.stressLevel >= 5
          ? '최근 신체적·심리적 에너지가 충분히 회복되지 못하는 상태일 수 있어요.'
          : '전반적인 컨디션은 비교적 안정적인 편이에요.',
    },
    factorAnalyses,
    missions,
    closing: '오늘 하루도 다정하게 응원할게요.',
  };
  return enrichReportFromSimulator(base, snapshot);
}

function buildSampleReport(): ResultReport {
  const base: ResultReport = {
    resultId: 123,
    nickname: '김철수',
    age: 32,
    gender: '남성',
    score: 65,
    riskLevel: 'WARNING',
    intro: {
      greeting: '안녕하세요, 김철수님!',
      scoreMessage: '현재 김철수님의 건강 점수는 65점이에요.',
      comfortMessage: '조금 신경 쓰이는 부분이 있지만, 함께 천천히 개선해 봐요.',
    },
    condition: {
      sleepLabel: '다소 부족한 수면 (5시간)',
      stressLabel: '보통 (PSS 22점/40점)',
      summary: '최근 신체적·심리적 에너지가 충분히 회복되지 못하는 상태일 수 있어요.',
    },
    factorAnalyses: [
      {
        factor: '심한 흡연',
        category: 'SMOKING',
        mateThought:
          '흡연은 생식 건강에 직접적인 영향을 미쳐요. 지금의 습관을 줄이면 회복에 도움이 될 수 있어요.',
        expectedChange: '완전 금연 시 정자 품질 회복에 큰 도움이 됩니다.',
      },
      {
        factor: '잦은 음주',
        category: 'DRINKING',
        mateThought:
          '잦은 음주는 호르몬 균형과 회복 리듬을 흐트러뜨릴 수 있어요. 음주 빈도를 줄이는 것부터 시작해 보세요.',
        expectedChange: '음주 빈도를 줄이면 수면과 컨디션 회복이 더 수월해질 수 있어요.',
      },
    ],
    missions: [
      {
        title: '흡연 욕구가 들 때 물 한 컵 마시기',
        description:
          '흡연 욕구가 올라오면 즉시 물 한 컵을 마시며 5분간 호흡을 가다듬어 보세요.',
        linkedFactor: '심한 흡연',
        category: 'SMOKING',
        frequency: { type: 'DAILY', count: 3, unit: '회' },
        duration: { value: 5, unit: '분' },
        difficulty: 'EASY',
        userAdjustable: true,
      },
    ],
    closing: '오늘 하루도 다정하게 응원할게요.',
  };
  const demo: SimulatorState = {
    ...useSimulatorStore.getState(),
    gender: 'male',
    age: 32,
    heightCm: 175,
    weightKg: 80,
    bmi: Math.round((80 / (1.75 * 1.75)) * 100) / 100,
    sleepHours: 6,
    smoking: 'often',
    alcohol: 'often',
    stressLevel: 6,
    pssSum: 22,
    smokeStatus: 'daily',
    drinkStatus: 'weeklyOrMore',
    bingeStatus: 'weeklyOrMore',
    hasSex12Mo: true,
    risk: 65,
  };
  return enrichReportFromSimulator(base, demo);
}

export function parseResultId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function resolveLatestResultIdFromApis(): Promise<number | null> {
  const home = await fetchHomeDashboard().catch(() => null);
  const rt = home?.recentTest;
  if (rt && typeof rt === 'object') {
    const rid =
      'resultId' in rt && typeof rt.resultId === 'number'
        ? rt.resultId
        : 'id' in rt && typeof (rt as { id?: unknown }).id === 'number'
          ? (rt as { id: number }).id
          : undefined;
    if (typeof rid === 'number' && rid > 0) return rid;
  }
  try {
    const raw = await fetchResultsHistoryRaw();
    const mapped = mapResultsHistoryToInspectionArchive(raw);
    const y = mapped.years[0];
    const m = y?.months[0];
    const r = m?.rounds[0];
    return r?.resultId ?? null;
  } catch {
    return null;
  }
}

/**
 * 홈 카드용 최신 결과 1건.
 * `GET /home`의 `recentTest.resultId` → `GET /api/results/{id}` (LLM 필드 포함, 추가 호출 없음).
 * 없으면 `GET /results/history`에서 가장 최근 `resultId` 시도.
 */
export async function fetchLatestResultReportForHome(): Promise<ResultReport | null> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!baseUrl) return null;
  const rid = await resolveLatestResultIdFromApis();
  if (!rid) return null;
  try {
    return await fetchResultReport(rid);
  } catch {
    return null;
  }
}

export async function fetchResultReport(resultId: number): Promise<ResultReport> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const snapshot = useSimulatorStore.getState();

  if (!baseUrl) {
    if (resultId === 123) return buildSampleReport();
    return buildMockReport(resultId, '담나', snapshot);
  }

  try {
    return await api.get<ResultReport>(`${RESULT_PATH}/${resultId}`);
  } catch {
    if (resultId === 123) return buildSampleReport();
    return buildMockReport(resultId, '담나', snapshot);
  }
}

export async function fetchLatestResultReport(
  snapshot: SimulatorState,
  nickname: string,
): Promise<ResultReport> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!baseUrl) {
    return buildMockReport(Date.now(), nickname, snapshot);
  }

  const rid = await resolveLatestResultIdFromApis().catch(() => null);
  if (rid) {
    try {
      return await fetchResultReport(rid);
    } catch {
      return buildMockReport(rid, nickname, snapshot);
    }
  }
  return buildMockReport(Date.now(), nickname, snapshot);
}

export function getRiskLevelLabel(riskLevel: ResultRiskLevel): string {
  if (riskLevel === 'SAFE') return '안전';
  if (riskLevel === 'WARNING') return '주의';
  return '위험';
}

export function getRiskLevelClassName(riskLevel: ResultRiskLevel): string {
  if (riskLevel === 'SAFE') return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  if (riskLevel === 'WARNING') return 'bg-amber-100 text-amber-700 ring-amber-200';
  return 'bg-rose-100 text-rose-700 ring-rose-200';
}

export function getDifficultyLabel(difficulty: ResultReport['missions'][number]['difficulty']): string {
  if (difficulty === 'EASY') return '쉬움';
  if (difficulty === 'MEDIUM') return '보통';
  return '어려움';
}

export function getDifficultyClassName(
  difficulty: ResultReport['missions'][number]['difficulty'],
): string {
  if (difficulty === 'EASY') return 'bg-emerald-100 text-emerald-700';
  if (difficulty === 'MEDIUM') return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
}

export function formatMissionFrequency(
  frequency: ResultReport['missions'][number]['frequency'],
  duration: ResultReport['missions'][number]['duration'],
): string {
  const cycle = frequency.type === 'DAILY' ? '매일' : '주';
  const count = `${cycle} ${frequency.count}${frequency.unit}`;
  if (duration.value && duration.unit) {
    return `${count} / ${duration.value}${duration.unit}`;
  }
  return count;
}
