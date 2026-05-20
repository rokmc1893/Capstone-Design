import type { UserMeDto } from '../types/backendApi';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { apiGenderToProfile, profileGenderToSimulator } from './userProfileGender';

/** `GET /users/me` · `PATCH /users/me` 결과를 로컬 프로필·인증·검사 스토어에 반영 */
export function applyUserMeToStores(dto: UserMeDto): void {
  const displayName = dto.displayName?.trim();
  if (displayName) {
    useUserProfileStore.getState().setName(displayName);
  } else if (dto.displayName === null) {
    useUserProfileStore.getState().setName('');
  }

  const nickname = dto.nickname?.trim();
  if (nickname) {
    useUserProfileStore.getState().setNickname(nickname);
    useAuthStore.getState().updateUserProfile({
      nickname,
      profileImageUrl: dto.profileImageUrl ?? null,
    });
  } else if (dto.profileImageUrl !== undefined) {
    useAuthStore.getState().updateUserProfile({
      profileImageUrl: dto.profileImageUrl,
    });
  }

  const profileGender = apiGenderToProfile(dto.gender);
  if (profileGender) {
    useUserProfileStore.getState().setGender(profileGender);
    useSimulatorStore.getState().setGender(profileGenderToSimulator(profileGender));
  }
}
