import { create } from 'zustand';

type Gender = 'male' | 'female';

type Frequency = 'none' | 'sometimes' | 'often';

/** 여성 검사 Step 2 — 질환 다중 선택 (API 키: pcos, endo, uf, pid, chlam, gon / none) */
export type FemaleConditions = {
  pcos: boolean;
  endo: boolean;
  uf: boolean;
  pid: boolean;
  chlam: boolean;
  gon: boolean;
  none: boolean;
};

/** 남성 검사 Step 3 — 질환 다중 선택 (API 키: chlam, gon / none) */
export type MaleConditions = {
  chlam: boolean;
  gon: boolean;
  none: boolean;
};

/** 남성 검사 Step 3 — 최근 30일 흡연 상태 (SMOKE30 매핑) */
export type SmokeStatus = 'none' | 'sometimes' | 'daily';
/** 남성 검사 Step 3 — 최근 1년 음주 빈도 (DRINK12 매핑) */
export type DrinkStatus = 'none' | 'monthly1to3' | 'weeklyOrMore';
/** 남성 검사 Step 4 — 1회 5잔 이상 폭음 빈도 (BINGE12 매핑) */
export type BingeStatus = 'none' | 'monthly1' | 'weeklyOrMore';
/** PSS(Perceived Stress Scale) 응답값 0~4 */
export type PssScore = 0 | 1 | 2 | 3 | 4;

function computeBmiFromHeightWeight(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 100) / 100;
}

export interface SimulatorState {
  gender: Gender;
  age: number;
  /** 신체 입력 (검사 설문 Step 1 등), BMI는 키·몸무게로 산출 */
  heightCm: number;
  weightKg: number;
  bmi: number;
  sleepHours: number;
  smoking: Frequency;
  alcohol: Frequency;
  stressLevel: number; // 0-10
  /** 초경 나이 (API: menarcheAge), 0 = 미입력 */
  menarcheAge: number;
  /** 임신/출산 경험 횟수 (API: parity) */
  parity: number;
  femaleConditions: FemaleConditions;
  /** 하루 평균 담배 개비 (API: SmokeLevel) */
  smokeLevel: number;
  /** 최근 1년 5잔+ 음주 일수 (API: binge12) */
  binge12: number;
  /** 생물학적 자녀 수 (API: numBioKid) */
  numBioKid: number;
  /** 최근 4주 성관계 횟수 (API: sexFreq) */
  sexFreq: number;
  /** 최근 12개월 성관계 여부 (API: hasSex12Mo), null = 미응답 */
  hasSex12Mo: boolean | null;
  maleConditions: MaleConditions;
  smokeStatus: SmokeStatus | null;
  drinkStatus: DrinkStatus | null;
  bingeStatus: BingeStatus | null;
  /** 주관적 수면 질(1~5), 선택 입력 */
  sleepQuality: number | null;
  /** PSS 1~10 응답값, 미응답은 null */
  pssAnswers: Array<PssScore | null>;
  /** PSS 1~10 합계 (AI 점수 계산 제외, 텍스트 가이드 생성용) */
  pssSum: number;
  risk: number; // 0-100
  topFactors: { label: string; value: number }[];
  setGender: (gender: Gender) => void;
  setAge: (age: number) => void;
  setBmi: (bmi: number) => void;
  setSleepHours: (hours: number) => void;
  setSmoking: (freq: Frequency) => void;
  setAlcohol: (freq: Frequency) => void;
  setStressLevel: (level: number) => void;
  /** 여성 검사 Step 1: 만 나이·키·몸무게 반영 후 BMI·위험도 재계산 */
  applyInspectionStep1: (payload: { age: number; heightCm: number; weightKg: number }) => void;
  /** 여성 검사 Step 2: 초경·출산·질환 (위험도 공식과 무관, API 보관용) */
  applyInspectionStep2: (payload: {
    menarcheAge: number;
    parity: number;
    femaleConditions: FemaleConditions;
  }) => void;
  /** 여성 검사 Step 3: 담배·음주·폭음 일수·수면 */
  applyInspectionStep3: (payload: {
    smokeLevel: number;
    drinkStatus: DrinkStatus;
    binge12: number;
    sleepHours: number;
  }) => void;
  /** 남성 검사 Step 2: 자녀·성관계 정보 저장 (AI 점수 계산과 분리) */
  applyInspectionMaleStep2: (payload: {
    numBioKid: number;
    sexFreq: number;
    hasSex12Mo: boolean;
  }) => void;
  /** 남성 검사 Step 3: 질환·흡연·음주 상태 반영 */
  applyInspectionMaleStep3: (payload: {
    maleConditions: MaleConditions;
    smokeStatus: SmokeStatus;
    drinkStatus: DrinkStatus;
  }) => void;
  /** 남성 검사 Step 4: 폭음 상태·수면시간·수면질 반영 */
  applyInspectionMaleStep4: (payload: {
    bingeStatus: BingeStatus;
    sleepHours: number;
    sleepQuality?: number | null;
  }) => void;
  /** 남성 검사 Step 5: PSS 1~2번 저장 */
  applyInspectionMaleStep5: (payload: { q1: PssScore; q2: PssScore }) => void;
  /** 남성 검사 Step 6: PSS 3~6번 저장 */
  applyInspectionMaleStep6: (payload: {
    q3: PssScore;
    q4: PssScore;
    q5: PssScore;
    q6: PssScore;
  }) => void;
  /** 남성 검사 Step 7: PSS 7~10번 저장 */
  applyInspectionMaleStep7: (payload: {
    q7: PssScore;
    q8: PssScore;
    q9: PssScore;
    q10: PssScore;
  }) => void;
  /** 새 검사 시작·제출 완료 후 설문 초안 초기화 */
  resetInspectionDraft: (gender: Gender) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const EMPTY_FEMALE_CONDITIONS: FemaleConditions = {
  pcos: false,
  endo: false,
  uf: false,
  pid: false,
  chlam: false,
  gon: false,
  none: false,
};

const EMPTY_MALE_CONDITIONS: MaleConditions = {
  chlam: false,
  gon: false,
  none: false,
};

const EMPTY_PSS_ANSWERS: Array<PssScore | null> = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

/** 검사 설문에만 쓰는 필드 — 시뮬레이터 기본값과 분리해 빈 폼으로 시작 */
function emptyInspectionDraft(gender: Gender) {
  const draft = {
    gender,
    age: 0,
    heightCm: 0,
    weightKg: 0,
    bmi: 0,
    sleepHours: 0,
    smoking: 'none' as Frequency,
    alcohol: 'none' as Frequency,
    stressLevel: 0,
    menarcheAge: 0,
    parity: 0,
    femaleConditions: { ...EMPTY_FEMALE_CONDITIONS },
    smokeLevel: 0,
    binge12: 0,
    numBioKid: 0,
    sexFreq: 0,
    hasSex12Mo: null as boolean | null,
    maleConditions: { ...EMPTY_MALE_CONDITIONS },
    smokeStatus: null as SmokeStatus | null,
    drinkStatus: null as DrinkStatus | null,
    bingeStatus: null as BingeStatus | null,
    sleepQuality: null as number | null,
    pssAnswers: [...EMPTY_PSS_ANSWERS],
    pssSum: 0,
  };
  const { risk, topFactors } = calculateRisk(draft);
  return { ...draft, risk, topFactors };
}

const calculateRisk = (
  state: Omit<
    SimulatorState,
    | 'risk'
    | 'topFactors'
    | 'setGender'
    | 'setAge'
    | 'setBmi'
    | 'setSleepHours'
    | 'setSmoking'
    | 'setAlcohol'
    | 'setStressLevel'
    | 'applyInspectionStep1'
    | 'applyInspectionStep2'
    | 'applyInspectionStep3'
    | 'applyInspectionMaleStep2'
    | 'applyInspectionMaleStep3'
    | 'applyInspectionMaleStep4'
    | 'applyInspectionMaleStep5'
    | 'applyInspectionMaleStep6'
    | 'applyInspectionMaleStep7'
    | 'resetInspectionDraft'
  >,
) => {
  let score = 0;

  // 나이
  if (state.age >= 35) score += 15;
  if (state.age >= 40) score += 10;

  // BMI
  if (state.bmi >= 23 && state.bmi < 25) score += 10;
  if (state.bmi >= 25) score += 15;

  // 수면
  if (state.sleepHours < 6) score += 15;
  else if (state.sleepHours < 7) score += 8;

  // 흡연
  if (state.smoking === 'sometimes') score += 10;
  if (state.smoking === 'often') score += 18;

  // 음주
  if (state.alcohol === 'sometimes') score += 6;
  if (state.alcohol === 'often') score += 12;

  // 스트레스
  score += state.stressLevel * 2;

  const base = 10;
  const risk = clamp(base + score, 0, 95);

  const factors: { label: string; value: number }[] = [
    { label: '스트레스', value: state.stressLevel * 2 },
    {
      label: '수면',
      value:
        state.sleepHours < 6 ? 15 : state.sleepHours < 7 ? 8 : 2,
    },
    {
      label: 'BMI',
      value:
        state.bmi >= 25 ? 15 : state.bmi >= 23 ? 10 : 3,
    },
  ];

  const sorted = factors
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return { risk, topFactors: sorted };
};

export const useSimulatorStore = create<SimulatorState>((set) => ({
  gender: 'female',
  age: 32,
  heightCm: 0,
  weightKg: 0,
  bmi: 23,
  sleepHours: 6,
  smoking: 'none',
  alcohol: 'sometimes',
  stressLevel: 5,
  menarcheAge: 0,
  parity: 0,
  femaleConditions: {
    pcos: false,
    endo: false,
    uf: false,
    pid: false,
    chlam: false,
    gon: false,
    none: false,
  },
  smokeLevel: 0,
  binge12: 0,
  numBioKid: 0,
  sexFreq: 0,
  hasSex12Mo: null,
  maleConditions: {
    chlam: false,
    gon: false,
    none: false,
  },
  smokeStatus: null,
  drinkStatus: null,
  bingeStatus: null,
  sleepQuality: null,
  pssAnswers: [null, null, null, null, null, null, null, null, null, null],
  pssSum: 0,
  risk: 0,
  topFactors: [],
  setGender: (gender) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, gender });
      return { gender, risk, topFactors };
    }),
  setAge: (age) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, age });
      return { age, risk, topFactors };
    }),
  setBmi: (bmi) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, bmi });
      return { bmi, risk, topFactors };
    }),
  setSleepHours: (sleepHours) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, sleepHours });
      return { sleepHours, risk, topFactors };
    }),
  setSmoking: (smoking) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, smoking });
      return { smoking, risk, topFactors };
    }),
  setAlcohol: (alcohol) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, alcohol });
      return { alcohol, risk, topFactors };
    }),
  setStressLevel: (stressLevel) =>
    set((state) => {
      const { risk, topFactors } = calculateRisk({ ...state, stressLevel });
      return { stressLevel, risk, topFactors };
    }),
  applyInspectionStep1: ({ age, heightCm, weightKg }) =>
    set((state) => {
      const bmi = computeBmiFromHeightWeight(heightCm, weightKg);
      const next = { ...state, age, heightCm, weightKg, bmi };
      const { risk, topFactors } = calculateRisk(next);
      return { age, heightCm, weightKg, bmi, risk, topFactors };
    }),
  applyInspectionStep2: ({ menarcheAge, parity, femaleConditions }) =>
    set({ menarcheAge, parity, femaleConditions }),
  applyInspectionStep3: ({ smokeLevel, drinkStatus, binge12, sleepHours }) =>
    set((state) => {
      const smoking: Frequency =
        smokeLevel === 0 ? 'none' : smokeLevel <= 10 ? 'sometimes' : 'often';
      const alcohol: Frequency =
        drinkStatus === 'none' ? 'none' : drinkStatus === 'monthly1to3' ? 'sometimes' : 'often';
      const next = { ...state, smokeLevel, drinkStatus, binge12, sleepHours, smoking, alcohol };
      const { risk, topFactors } = calculateRisk(next);
      return { smokeLevel, drinkStatus, binge12, sleepHours, smoking, alcohol, risk, topFactors };
    }),
  applyInspectionMaleStep2: ({ numBioKid, sexFreq, hasSex12Mo }) =>
    set({ numBioKid, sexFreq, hasSex12Mo }),
  applyInspectionMaleStep3: ({ maleConditions, smokeStatus, drinkStatus }) =>
    set((state) => {
      const smoking: Frequency =
        smokeStatus === 'none' ? 'none' : smokeStatus === 'sometimes' ? 'sometimes' : 'often';
      const alcohol: Frequency =
        drinkStatus === 'none' ? 'none' : drinkStatus === 'monthly1to3' ? 'sometimes' : 'often';
      const next = { ...state, maleConditions, smokeStatus, drinkStatus, smoking, alcohol };
      const { risk, topFactors } = calculateRisk(next);
      return { maleConditions, smokeStatus, drinkStatus, smoking, alcohol, risk, topFactors };
    }),
  applyInspectionMaleStep4: ({ bingeStatus, sleepHours, sleepQuality = null }) =>
    set((state) => {
      const bingeAlcohol: Frequency =
        bingeStatus === 'none' ? 'none' : bingeStatus === 'monthly1' ? 'sometimes' : 'often';
      const alcohol: Frequency = bingeAlcohol === 'often' ? 'often' : state.alcohol;
      const next = { ...state, bingeStatus, sleepHours, sleepQuality, alcohol };
      const { risk, topFactors } = calculateRisk(next);
      return { bingeStatus, sleepHours, sleepQuality, alcohol, risk, topFactors };
    }),
  applyInspectionMaleStep5: ({ q1, q2 }) =>
    set((state) => {
      const pssAnswers: Array<PssScore | null> = [...state.pssAnswers];
      pssAnswers[0] = q1;
      pssAnswers[1] = q2;
      const pssSum = pssAnswers.reduce<number>((acc, v) => acc + (v ?? 0), 0);
      return { pssAnswers, pssSum };
    }),
  applyInspectionMaleStep6: ({ q3, q4, q5, q6 }) =>
    set((state) => {
      const pssAnswers: Array<PssScore | null> = [...state.pssAnswers];
      pssAnswers[2] = q3;
      pssAnswers[3] = q4;
      pssAnswers[4] = q5;
      pssAnswers[5] = q6;
      const pssSum = pssAnswers.reduce<number>((acc, v) => acc + (v ?? 0), 0);
      return { pssAnswers, pssSum };
    }),
  applyInspectionMaleStep7: ({ q7, q8, q9, q10 }) =>
    set((state) => {
      const pssAnswers: Array<PssScore | null> = [...state.pssAnswers];
      pssAnswers[6] = q7;
      pssAnswers[7] = q8;
      pssAnswers[8] = q9;
      pssAnswers[9] = q10;
      const pssSum = pssAnswers.reduce<number>((acc, v) => acc + (v ?? 0), 0);
      return { pssAnswers, pssSum };
    }),
  resetInspectionDraft: (gender) => set(emptyInspectionDraft(gender)),
}));

// 초기 상태에서 risk/topFactors 계산
const initial = useSimulatorStore.getState();
const initialCalc = calculateRisk(initial);
useSimulatorStore.setState(initialCalc);

