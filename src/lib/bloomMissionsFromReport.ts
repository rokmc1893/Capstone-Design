import type { ResultReport } from '../types/resultReport';

export type BloomMissionRow = {
  id: string;
  title: string;
  description: string;
};

const FALLBACK_MISSIONS: BloomMissionRow[] = [
  {
    id: 'quit-smoking',
    title: '금연하기',
    description: '오늘 담배를 피우지는 않으셨죠?',
  },
  {
    id: 'exercise-30',
    title: '30분 운동하기',
    description: '조깅, 윗몸 일으키기 등 운동을 해주세요',
  },
  {
    id: 'sleep-7h',
    title: '적정 수면시간 유지하기',
    description: '7시간 주무셨나요?',
  },
];

/** 검사 결과(`ResultReport.missions`)가 있으면 그걸 미션 목록으로 쓰고, 없으면 기본 3종 */
export function missionsFromResultReport(report: ResultReport | null | undefined): BloomMissionRow[] {
  const list = report?.missions;
  if (list && list.length > 0) {
    const rid = report?.resultId ?? 0;
    return list.map((m, i) => ({
      id: `m-${rid}-${i}`,
      title: m.title,
      description: m.description,
    }));
  }
  return FALLBACK_MISSIONS;
}
