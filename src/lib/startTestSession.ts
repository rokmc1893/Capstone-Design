import { fetchUserMe, patchUserMe, postSproutResetAfterRetest } from './homeMissionsApi';
import { postTestsStart, type ApiGender } from './testsSessionApi';
import {
  apiGenderToProfile,
  profileGenderToApi,
} from './userProfileGender';
import { applyUserMeToStores } from './userProfileSync';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import type { ProfileGender } from '../store/useUserProfileStore';

function uiToProfileGender(g: 'male' | 'female'): ProfileGender {
  return g === 'male' ? '남자' : '여자';
}

/**
 * 검사하기 성별 선택 후 세션 시작.
 * 1) 선택 성별 → PATCH /users/me
 * 2) GET /users/me 로 gender 확인
 * 3) POST /tests/start { gender: M|F } — 서버 프로필 gender 사용
 */
export async function startTestSessionAfterGenderPick(
  uiGender: 'male' | 'female',
): Promise<string | null> {
  const base = import.meta.env.VITE_API_BASE_URL;
  const profileGender = uiToProfileGender(uiGender);

  useUserProfileStore.getState().setGender(profileGender);
  useSimulatorStore.getState().resetInspectionDraft(uiGender);

  if (!base) return null;

  try {
    if (useBloomMissionsStore.getState().level === 5) {
      try {
        await postSproutResetAfterRetest();
        useBloomMissionsStore.getState().applyHomeSprout({ level: 1, exp: 0 });
      } catch {
        /* Lv.5가 아니면 무시 */
      }
    }

    await patchUserMe({ gender: profileGenderToApi(profileGender) });
    const me = await fetchUserMe();
    applyUserMeToStores(me);

    const fromServer = apiGenderToProfile(me.gender);
    const startApiGender: ApiGender = fromServer
      ? profileGenderToApi(fromServer)
      : profileGenderToApi(profileGender);

    const { sessionId } = await postTestsStart(startApiGender);
    return sessionId;
  } catch {
    return null;
  }
}
