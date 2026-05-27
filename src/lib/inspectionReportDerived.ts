import type { SimulatorState } from '../store/useSimulatorStore';
import type {
  ResultComparisonRow,
  ResultComparisonTrend,
  ResultQuestionnaireGroup,
  ResultReport,
} from '../types/resultReport';
import {
  API_BINGE_LABELS,
  API_DRINK_LABELS,
  API_SMOKE_LABELS,
} from './testsSessionMappers';

export type ReportSnapshot = Pick<
  SimulatorState,
  | 'gender'
  | 'age'
  | 'heightCm'
  | 'weightKg'
  | 'bmi'
  | 'sleepHours'
  | 'smoking'
  | 'alcohol'
  | 'stressLevel'
  | 'pssSum'
  | 'risk'
  | 'menarcheAge'
  | 'parity'
  | 'femaleConditions'
  | 'smokeLevel'
  | 'binge12'
  | 'numBioKid'
  | 'sexFreq'
  | 'hasSex12Mo'
  | 'maleConditions'
  | 'smokeStatus'
  | 'drinkStatus'
  | 'bingeStatus'
  | 'sleepQuality'
>;

function roundPct(n: number): number {
  return Math.round(n * 10) / 10;
}

/** 위험도 점수(높을수록 불리) → 화면용 웰니스 점수 */
export function wellnessScoreFromRisk(risk: number): number {
  return Math.max(0, Math.min(100, 100 - Math.round(risk)));
}

function pctDiffPhrase(my: number, avg: number, higherIsWorse: boolean): { pct: number; trend: ResultComparisonTrend; text: string } {
  if (avg === 0 || !Number.isFinite(my) || !Number.isFinite(avg)) {
    return { pct: 0, trend: 'neutral', text: '평균과 비슷한 수준입니다' };
  }
  const raw = ((my - avg) / avg) * 100;
  const pct = roundPct(Math.abs(raw));
  if (pct < 8) {
    return { pct, trend: 'neutral', text: `평균과 비슷합니다 (${pct}% 이내 차이)` };
  }
  if (raw > 0) {
    if (higherIsWorse) {
      return { pct, trend: 'higher', text: `${pct}% 더 높습니다` };
    }
    return { pct, trend: 'lower', text: `${pct}% 더 높습니다` };
  }
  if (raw < 0) {
    if (higherIsWorse) {
      return { pct, trend: 'lower', text: `${pct}% 더 낮습니다` };
    }
    return { pct, trend: 'higher', text: `${pct}% 더 낮습니다` };
  }
  return { pct: 0, trend: 'neutral', text: '평균과 비슷한 수준입니다' };
}

function femaleSmokeLabel(level: number): string {
  if (level <= 0) return '비흡연';
  if (level <= 10) return '가끔';
  return '매일';
}

function femaleDrinkLabel(status: SimulatorState['drinkStatus'], binge12: number): string {
  if (status) return maleDrinkLabel(status);
  if (binge12 <= 0) return '없음';
  if (binge12 <= 11) return '월 1~3회';
  return '주 1회 이상';
}

function maleSmokeLabel(status: SimulatorState['smokeStatus']): string {
  if (!status) return '—';
  return API_SMOKE_LABELS[status];
}

function maleDrinkLabel(status: SimulatorState['drinkStatus']): string {
  if (!status) return '—';
  return API_DRINK_LABELS[status];
}

function maleBingeLabel(status: SimulatorState['bingeStatus']): string {
  if (!status) return '—';
  return API_BINGE_LABELS[status];
}

function femaleDiseaseSummary(fc: SimulatorState['femaleConditions']): string {
  const keys: { k: keyof typeof fc; label: string }[] = [
    { k: 'pcos', label: 'PCOS' },
    { k: 'endo', label: '자궁내막증' },
    { k: 'uf', label: '자궁근종' },
    { k: 'pid', label: '골반염' },
    { k: 'chlam', label: '클라미디아' },
    { k: 'gon', label: '임질' },
  ];
  const on = keys.filter((x) => fc[x.k]).map((x) => x.label);
  const anyDisease = on.length > 0;
  if (fc.none && !anyDisease) return '해당 없음';
  if (anyDisease) return on.join(', ');
  return '미입력';
}

function maleDiseaseSummary(mc: SimulatorState['maleConditions']): string {
  const parts: string[] = [];
  if (mc.chlam) parts.push('클라미디아');
  if (mc.gon) parts.push('임질');
  if (mc.none && parts.length === 0) return '해당 없음';
  if (parts.length > 0) return parts.join(', ');
  return '미입력';
}

function sexLabel(has: boolean | null): string {
  if (has === true) return '있음';
  if (has === false) return '없음';
  return '미응답';
}

export function buildQuestionnaireGroups(report: ResultReport, s: SimulatorState): ResultQuestionnaireGroup[] {
  const age = s.age > 0 ? s.age : report.age;
  const groups: ResultQuestionnaireGroup[] = [];

  const bodyRows: { label: string; value: string }[] = [
    { label: '나이', value: `${age}세` },
  ];
  if (s.heightCm > 0) bodyRows.push({ label: '키', value: `${s.heightCm}cm` });
  if (s.weightKg > 0) bodyRows.push({ label: '몸무게', value: `${s.weightKg}kg` });
  if (s.heightCm > 0 && s.weightKg > 0) {
    bodyRows.push({ label: 'BMI', value: `${s.bmi}` });
  }
  groups.push({ title: '신체', rows: bodyRows });

  if (s.gender === 'female') {
    const gyn: { label: string; value: string }[] = [];
    if (s.menarcheAge >= 8 && s.menarcheAge <= 18) {
      gyn.push({ label: '초경 나이', value: `${s.menarcheAge}세` });
    }
    gyn.push({ label: '임신/출산', value: `${s.parity}회` });
    gyn.push({ label: '관련 질환', value: femaleDiseaseSummary(s.femaleConditions) });
    groups.push({ title: '여성 건강', rows: gyn });
  }

  const life: { label: string; value: string }[] = [];
  if (s.gender === 'female') {
    life.push({ label: '흡연', value: femaleSmokeLabel(s.smokeLevel) });
    life.push({ label: '음주', value: femaleDrinkLabel(s.drinkStatus, s.binge12) });
    life.push({ label: '폭음', value: `${s.binge12}일` });
  } else {
    life.push({ label: '흡연', value: maleSmokeLabel(s.smokeStatus) });
    life.push({ label: '음주', value: maleDrinkLabel(s.drinkStatus) });
    life.push({ label: '폭음 빈도', value: maleBingeLabel(s.bingeStatus) });
    life.push({ label: '관련 질환', value: maleDiseaseSummary(s.maleConditions) });
    life.push({ label: '생물학적 자녀 수', value: `${s.numBioKid}명` });
    life.push({ label: '최근 4주 성관계', value: `${s.sexFreq}회` });
  }
  life.push({ label: '성관계 여부(12개월)', value: sexLabel(s.hasSex12Mo) });
  life.push({ label: '수면', value: `${s.sleepHours}시간` });
  if (s.sleepQuality != null && s.sleepQuality > 0) {
    life.push({ label: '수면 질(주관)', value: `${s.sleepQuality}/5` });
  }
  if (s.pssSum > 0) {
    life.push({ label: '스트레스 점수 (PSS)', value: `${s.pssSum}점` });
  } else {
    life.push({ label: '스트레스(자가)', value: `${s.stressLevel}/10` });
  }
  groups.push({ title: '생활습관', rows: life });

  return groups;
}

/** 내부 위험 지수(0~100) — 평균 대비 % 비교용 */
function smokingRiskIndex(s: SimulatorState): number {
  if (s.gender === 'female') {
    if (s.smokeLevel <= 0) return 12;
    if (s.smokeLevel <= 10) return 42;
    return 88;
  }
  if (s.smokeStatus === 'none') return 12;
  if (s.smokeStatus === 'sometimes') return 44;
  if (s.smokeStatus === 'daily') return 86;
  return 30;
}

function alcoholRiskIndex(s: SimulatorState): number {
  if (s.gender === 'female') {
    if (s.drinkStatus === 'weeklyOrMore') return 78;
    if (s.drinkStatus === 'monthly1to3') return 40;
    if (s.drinkStatus === 'none') return 15;
    if (s.binge12 <= 0) return 15;
    if (s.binge12 <= 11) return 40;
    return 78;
  }
  let v = 20;
  if (s.drinkStatus === 'weeklyOrMore') v += 35;
  else if (s.drinkStatus === 'monthly1to3') v += 18;
  if (s.bingeStatus === 'weeklyOrMore') v += 28;
  else if (s.bingeStatus === 'monthly1') v += 12;
  return Math.min(95, v);
}

const POP_AVG = {
  bmi: 23.2,
  sleep: 7.0,
  pss: 14.5,
  smokingRisk: 28,
  alcoholRisk: 32,
};

export function buildComparisonTable(_report: ResultReport, s: SimulatorState): ResultComparisonRow[] {
  const rows: ResultComparisonRow[] = [];

  if (s.heightCm > 0 && s.weightKg > 0) {
    const { trend, text } = pctDiffPhrase(s.bmi, POP_AVG.bmi, true);
    rows.push({
      item: 'BMI',
      myValue: String(s.bmi),
      averageValue: String(POP_AVG.bmi),
      comparisonResult: text,
      trend,
    });
  }

  {
    const myH = s.sleepHours;
    const avgH = POP_AVG.sleep;
    const raw = ((myH - avgH) / avgH) * 100;
    const ap = roundPct(Math.abs(raw));
    let trend: ResultComparisonTrend = 'neutral';
    let text: string;
    if (ap < 8) {
      text = `평균과 비슷합니다 (${ap}% 이내 차이)`;
    } else if (myH < avgH) {
      trend = 'lower';
      text = `${ap}% 더 낮습니다`;
    } else {
      text = `${ap}% 더 높습니다 (평균보다 여유로운 편)`;
      trend = 'neutral';
    }
    rows.push({
      item: '수면시간',
      myValue: `${myH}시간`,
      averageValue: `${avgH}시간`,
      comparisonResult: text,
      trend,
    });
  }

  if (s.pssSum > 0) {
    const p = pctDiffPhrase(s.pssSum, POP_AVG.pss, true);
    rows.push({
      item: 'PSS',
      myValue: `${s.pssSum}점`,
      averageValue: `${POP_AVG.pss}점`,
      comparisonResult: p.text,
      trend: p.trend,
    });
  }

  const smMy = smokingRiskIndex(s);
  const sm = pctDiffPhrase(smMy, POP_AVG.smokingRisk, true);
  rows.push({
    item: '흡연',
    myValue: s.gender === 'female' ? femaleSmokeLabel(s.smokeLevel) : maleSmokeLabel(s.smokeStatus),
    averageValue: '낮음',
    comparisonResult: sm.text,
    trend: sm.trend,
  });

  const alMy = alcoholRiskIndex(s);
  const al = pctDiffPhrase(alMy, POP_AVG.alcoholRisk, true);
  rows.push({
    item: '음주',
    myValue:
      s.gender === 'female'
        ? femaleDrinkLabel(s.drinkStatus, s.binge12)
        : maleDrinkLabel(s.drinkStatus),
    averageValue: '보통',
    comparisonResult: al.text,
    trend: al.trend,
  });

  return rows;
}

export function buildCoreRiskBullets(
  report: ResultReport,
  comparisons: ResultComparisonRow[],
): string[] {
  const bullets: string[] = [];
  const seen = new Set<string>();

  const push = (t: string) => {
    if (!t || seen.has(t)) return;
    seen.add(t);
    bullets.push(t);
  };

  for (const row of comparisons) {
    if (row.trend === 'neutral') continue;
    if (row.item === 'BMI' && row.trend === 'higher') push('BMI 수치가 평균보다 높습니다.');
    if (row.item === '수면시간' && row.trend === 'lower') push('수면 시간이 평균보다 부족합니다.');
    if (row.item === 'PSS' && row.trend === 'higher') push('스트레스(PSS) 점수가 평균보다 높습니다.');
    if (row.item === '흡연' && row.trend === 'higher') push('흡연 관련 위험도가 평균보다 높습니다.');
    if (row.item === '음주' && row.trend === 'higher') push('음주 관련 위험도가 평균보다 높습니다.');
  }

  for (const f of report.factorAnalyses) {
    if (f.category === 'SMOKING') push('흡연 습관이 건강 점수를 낮추는 요인으로 보입니다.');
    if (f.category === 'DRINKING') push('음주 패턴이 건강에 부담을 줄 수 있습니다.');
    if (f.category === 'SLEEP') push('수면 부족이 누적 피로와 회복에 영향을 줄 수 있습니다.');
  }

  if (bullets.length === 0) {
    push('현재 입력값 기준으로 뚜렷한 고위험 패턴은 보이지 않습니다. 꾸준한 관리를 이어가 주세요.');
  }

  return bullets.slice(0, 6);
}

export function buildFallbackPersonalizedNarrative(report: ResultReport, bullets: string[]): string {
  const name = report.nickname;
  const scoreLine = `현재 ${name}님의 입력과 평균 비교를 바탕으로 보면,`;
  const body = bullets.slice(0, 4).join(' ');
  const tail =
    ' 생활 습관은 천천히 조정할수록 몸의 반응이 좋아지기 쉬우니, 무리하지 않는 범위에서 개선을 시도해 보시면 좋습니다.';
  return `${scoreLine} ${body}${tail}`;
}

export function buildActionGuideBullets(report: ResultReport): string[] {
  const fromMissions = report.missions.map((m) => m.description || m.title);
  const extras: string[] = [];
  if (report.condition.sleepLabel.includes('부족')) {
    extras.push('수면 시간을 하루 7시간 이상 확보하는 것을 목표로 해 보세요.');
  }
  if (report.factorAnalyses.some((f) => f.category === 'SMOKING')) {
    extras.push('흡연량을 줄이거나 금연 상담 등 전문 지원을 함께 고려해 보세요.');
  }
  if (report.factorAnalyses.some((f) => f.category === 'DRINKING')) {
    extras.push('음주 빈도를 줄이고 금주일을 정해 몸의 회복 시간을 늘려 보세요.');
  }
  extras.push('주 3회 이상 가벼운 유산소 운동은 전반적인 컨디션에 도움이 될 수 있어요.');

  const merged = [...fromMissions, ...extras];
  const uniq: string[] = [];
  const s = new Set<string>();
  for (const line of merged) {
    const t = line.trim();
    if (!t || s.has(t)) continue;
    s.add(t);
    uniq.push(t);
  }
  return uniq.slice(0, 8);
}

export function enrichReportFromSimulator(report: ResultReport, snapshot: SimulatorState): ResultReport {
  const useMockBenchmark = import.meta.env.VITE_USE_MOCK_BENCHMARK === 'true';

  const questionnaireGroups =
    report.questionnaireGroups && report.questionnaireGroups.length > 0
      ? report.questionnaireGroups
      : buildQuestionnaireGroups(report, snapshot);

  const comparisonTable =
    report.comparisonTable && report.comparisonTable.length > 0
      ? report.comparisonTable
      : useMockBenchmark
        ? buildComparisonTable(report, snapshot)
        : [];

  const coreRiskBullets =
    report.coreRiskBullets && report.coreRiskBullets.length > 0
      ? report.coreRiskBullets
      : buildCoreRiskBullets(report, comparisonTable);

  const personalizedAnalysis =
    report.personalizedAnalysis?.trim() ||
    buildFallbackPersonalizedNarrative(report, coreRiskBullets);

  const actionGuideBullets =
    report.actionGuideBullets && report.actionGuideBullets.length > 0
      ? report.actionGuideBullets
      : buildActionGuideBullets(report);

  return {
    ...report,
    questionnaireGroups,
    comparisonTable,
    coreRiskBullets,
    personalizedAnalysis,
    actionGuideBullets,
  };
}

/**
 * @deprecated 서버 응답과 시뮬레이터를 섞지 마세요. 로컬 목·시뮬레이터 전용으로 `enrichReportFromSimulator`만 사용합니다.
 */
export function enrichReportPresentation(report: ResultReport, snapshot: SimulatorState): ResultReport {
  return enrichReportFromSimulator(report, snapshot);
}
