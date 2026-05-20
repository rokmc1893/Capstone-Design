/** 가벼운 터치 피드백 (지원 기기만) */
export function communityHapticLight() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* ignore */
  }
}
