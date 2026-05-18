/**
 * 카카오 OAuth 콜백 처리 페이지 (프론트)
 *
 * 꼭 전달하면 좋은 것 (한 줄 요약)
 *
 * 콜백 동작
 * 카카오 로그인 후 더 이상 백엔드가 JSON을 주지 않고, 302로 프론트로 리다이렉트합니다.
 *
 * 리다이렉트 주소 (기본값)
 * http://localhost:5173/oauth/kakao/callback
 *
 * 쿼리: accessToken, refreshToken, userId, nickname (URL 인코딩됨)
 *
 * 운영/스테이징
 * 백엔드 서버에 OAUTH_KAKAO_FRONTEND_CALLBACK_URL(또는 설정에 oauth.kakao.frontend-callback-url)을 실제 프론트 URL로 넣어야 합니다.
 * 예: https://xxx.com/oauth/kakao/callback
 * → 프론트 배포 주소가 바뀌면 백엔드 환경변수도 같이 맞춰야 합니다.
 *
 * 카카오 콘솔
 * Redirect URI는 여전히 백엔드 (…/oauth/kakao/callback) — 이건 바꾸지 않습니다.
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { applyUserMeToStores } from '../lib/userProfileSync';
import { useAuthStore } from '../store/useAuthStore';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')?.trim();
    const refreshToken = searchParams.get('refreshToken')?.trim();
    const userId = searchParams.get('userId')?.trim();
    const nickname = searchParams.get('nickname')?.trim();

    if (accessToken && refreshToken) {
      const resolvedNickname = nickname || '사용자';
      setAuth({
        method: 'kakao',
        email: null,
        accessToken,
        refreshToken,
        user: {
          userId: Number(userId ?? 0),
          nickname: resolvedNickname,
          profileImageUrl: null,
          isTermsAgreed: false,
        },
      });
      applyUserMeToStores({
        nickname: resolvedNickname,
        profileImageUrl: null,
      });
      navigate('/home', { replace: true });
    } else {
      // 토큰이 없으면 로그인 화면으로
      navigate('/login', { replace: true });
    }
  }, [searchParams, setAuth, navigate]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
    >
      <div className="flex flex-col items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-[15px] font-medium">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;
