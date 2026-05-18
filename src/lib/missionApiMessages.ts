import { ApiError } from './api';

const CODE_MESSAGES: Record<string, string> = {
  WMISSION400_3: '최신 검사 결과가 아니에요. 먼저 검사를 완료해 주세요.',
  WMISSION400_4: '오늘 노출된 미션 슬롯이 아니에요.',
  MISSION400_1: '새싹이 최종 단계일 때만 초기화할 수 있어요.',
};

export function missionErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    return CODE_MESSAGES[err.code] ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return '요청을 처리하지 못했어요.';
}
