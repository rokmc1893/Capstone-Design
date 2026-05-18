/** 홈·설정 등에 표시할 이름 (로그인 계정 우선) */
export function getDisplayName(
  authNickname?: string | null,
  profileNickname?: string,
  profileName?: string,
): string {
  return (
    authNickname?.trim() ||
    profileNickname?.trim() ||
    profileName?.trim() ||
    '회원'
  );
}
