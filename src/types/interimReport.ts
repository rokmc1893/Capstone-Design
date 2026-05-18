export type ObesityStage = 'NONE' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3';

export type InterimReportDto = {
  sleepCalculated?: boolean;
  sleepAgeBand?: string | null;
  sleepAvgHours?: number | null;
  sleepDeltaHours?: number | null;

  obesityCalculated?: boolean;
  bmi?: number | null;
  obesityStage?: ObesityStage | string | null;
  obesityPrevalencePct?: number | null;
  ageSexMeanBmi?: number | null;
  bmiDeltaVsAgeSexMeanPct?: number | null;
  bmiDistanceToStageBoundary?: number | null;
  bmiDistanceDirection?: string | null;

  resultId?: number | null;
  aiScore?: number | null;
  riskProbability?: number | null;
  riskLevel?: string | null;
  topFactors?: string[] | null;
};
