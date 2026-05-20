/**
 * 홈·설정 인사말 — `displayName`(로컬 name) → nickname → 로그인 nickname
 * @param profileDisplayName `GET /users/me`의 displayName (로컬 `name`에 동기화)
 */
export function getDisplayName(
  authNickname?: string | null,
  profileNickname?: string,
  profileDisplayName?: string,
): string {
  return (
    profileDisplayName?.trim() ||
    profileNickname?.trim() ||
    authNickname?.trim() ||
    '회원'
  );
}
