import { getDisplayName } from '../displayName';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserProfileStore } from '../../store/useUserProfileStore';

/** 현재 사용자 닉네임 + 상호작용용 id (로컬 MVP) */
export function useCommunityAuthor() {
  const authNickname = useAuthStore((s) => s.user?.nickname);
  const profileName = useUserProfileStore((s) => s.name);
  const profileNickname = useUserProfileStore((s) => s.nickname);
  const displayName = getDisplayName(authNickname, profileNickname, profileName);
  const authUserId = useAuthStore((s) => s.user?.userId);
  /** 닉네임과 겹치지 않도록 로그인 시 서버 userId 사용 (시드 좋아요·다른 사용자와 분리) */
  const userId =
    authUserId != null && Number.isFinite(authUserId)
      ? `user-${authUserId}`
      : `guest-${displayName || 'anonymous'}`;
  return { displayName, userId };
}
