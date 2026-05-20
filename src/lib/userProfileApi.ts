import { fetchUserMe } from './homeMissionsApi';
import { applyUserMeToStores } from './userProfileSync';

/** 홈·검사 진입 시 프로필(displayName, gender) 서버 동기화 */
export async function refreshUserProfileFromServer(): Promise<void> {
  if (!import.meta.env.VITE_API_BASE_URL) return;
  try {
    const me = await fetchUserMe();
    applyUserMeToStores(me);
  } catch {
    /* 로그인 만료 등은 api 레이어에서 처리 */
  }
}
