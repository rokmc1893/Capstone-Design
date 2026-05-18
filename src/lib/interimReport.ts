import { api } from './api';
import type { InterimReportDto, ObesityStage } from '../types/interimReport';
import type { SimulatorState } from '../store/useSimulatorStore';

export async function fetchInterimReport(sessionId: string): Promise<InterimReportDto> {
  return api.get<InterimReportDto>(`/tests/${sessionId}/interim-report`);
}

export function obesityStageLabel(stage: ObesityStage | string | null | undefined): string {
  switch (stage) {
    case 'NONE':
      return '정상 체중';
    case 'STAGE_1':
      return '1단계 비만';
    case 'STAGE_2':
      return '2단계 비만';
    case 'STAGE_3':
      return '3단계 비만';
    default:
      return '—';
  }
}

export function formatSleepDeltaHours(delta: number | null | undefined): string | null {
  if (delta == null || !Number.isFinite(delta)) return null;
  const abs = Math.abs(delta);
  const h = abs % 1 === 0 ? String(abs) : abs.toFixed(1);
  if (delta < 0) return `또래 평균보다 ${h}시간 적어요`;
  if (delta > 0) return `또래 평균보다 ${h}시간 많아요`;
  return '또래 평균과 비슷해요';
}

export function formatBmiDeltaPct(pct: number | null | undefined): string | null {
  if (pct == null || !Number.isFinite(pct)) return null;
  const abs = Math.abs(pct);
  const v = abs % 1 === 0 ? String(abs) : abs.toFixed(1);
  if (pct > 0) return `또래 평균 BMI보다 ${v}% 높아요`;
  if (pct < 0) return `또래 평균 BMI보다 ${v}% 낮아요`;
  return '또래 평균 BMI와 비슷해요';
}

/** API·세션 없을 때 로컬 설문으로 대략적인 중간 화면 */
export function buildMockInterimReport(snapshot: SimulatorState): InterimReportDto {
  const bmi = snapshot.bmi > 0 ? snapshot.bmi : 22;
  let obesityStage: ObesityStage = 'NONE';
  if (bmi >= 35) obesityStage = 'STAGE_3';
  else if (bmi >= 30) obesityStage = 'STAGE_2';
  else if (bmi >= 25) obesityStage = 'STAGE_1';

  const sleepHours = snapshot.sleepHours > 0 ? snapshot.sleepHours : 7;
  const sleepDelta = sleepHours - 7.4;

  return {
    sleepCalculated: true,
    sleepAgeBand: '20~30대',
    sleepAvgHours: 7.4,
    sleepDeltaHours: Math.round(sleepDelta * 10) / 10,
    obesityCalculated: true,
    bmi,
    obesityStage,
    obesityPrevalencePct: obesityStage === 'NONE' ? 12 : 35,
    ageSexMeanBmi: 23.5,
    bmiDeltaVsAgeSexMeanPct: bmi > 23.5 ? Math.round(((bmi - 23.5) / 23.5) * 1000) / 10 : 0,
  };
}
