import type { UserMeDto } from '../types/backendApi';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

/** `GET /users/me` 결과를 로컬 프로필·인증 스토어에 반영 */
export function applyUserMeToStores(dto: UserMeDto): void {
  if (dto.nickname?.trim()) {
    const nickname = dto.nickname.trim();
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
}
