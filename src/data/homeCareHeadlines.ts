/**
 * 홈 상단 케어 헤드라인 — 부드러운 톤, 1~2줄, 랜덤 노출
 * (응원·동기부여·명언 스타일 지양)
 */
export const HOME_CARE_HEADLINES: readonly string[] = [
  '오늘도 건강하게',
  '몸의 작은 신호도\n소중해요',
  '오늘 컨디션은\n어떤가요',
  '스스로를 챙기는\n하루가 되길',
  '건강은 작은 관심에서\n시작돼요',
  '몸이 보내는 이야기에\n귀 기울여보세요',
  '오늘의 나를 더 잘\n이해해보세요',
  '좋은 컨디션으로\n시작해요',
  '오늘도 나를\n조금 더 살펴보아요',
  '바쁜 하루,\n잠깐의 여유를 허락해요',
  '몸과 마음을\n가볍게 돌봐요',
  '작은 루틴이\n큰 변화를 만들어요',
  '어제보다 편안한\n하루가 되길',
  '나를 위한 시간,\n오늘도 괜찮아요',
  '컨디션을 함께\n살펴볼까요',
  '천천히,\n충분히 쉬어가요',
  '건강은 오늘의\n선택에서 자라요',
  '몸의 리듬을\n존중해보세요',
  '무리하지 않는 하루,\n그것도 충분해요',
  '오늘의 신호를\n놓치지 않도록',
  '나에게 필요한 것만\n담아가요',
  '부드러운 하루를\n시작해요',
  '관심이 곧\n케어가 돼요',
  '지금 이 순간의\n몸을 들여다봐요',
  '편안함이 먼저\n오는 건강',
  '작은 확인이\n마음을 놓여줘요',
  '오늘은 나를\n먼저 챙겨요',
  '몸이 말하는 것에\n잠시 집중해요',
  '하루를 가볍게\n열어보세요',
  '나를 돌보는 습관,\n오늘부터 이어가요',
];

const SESSION_KEY = 'fertility-home-care-headline';

function pickRandomHeadline(): string {
  const idx = Math.floor(Math.random() * HOME_CARE_HEADLINES.length);
  return HOME_CARE_HEADLINES[idx] ?? HOME_CARE_HEADLINES[0];
}

/** 브라우저 탭·앱 세션당 한 문구 유지 (실행 시마다 변경) */
export function getSessionCareHeadline(): string {
  if (typeof sessionStorage === 'undefined') return pickRandomHeadline();
  try {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached && (HOME_CARE_HEADLINES as readonly string[]).includes(cached)) {
      return cached;
    }
    const next = pickRandomHeadline();
    sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return pickRandomHeadline();
  }
}

export function splitCareHeadlineLines(text: string): string[] {
  return text.split('\n').filter((line) => line.length > 0);
}
