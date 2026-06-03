import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BottomTabNav } from '../components/BottomTabNav';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import { GRADIENT_BG_STYLE, MOBILE_FRAME, MOBILE_SHELL } from '../components/ui/glassStyles';
import { useAuthStore } from '../store/useAuthStore';

/** 홈·미션·커뮤니티 — 하단 탭을 라우트 전환 시에도 유지 */
export function MainTabLayout() {
  const navigate = useNavigate();
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken || !refreshToken) {
      navigate('/login', { replace: true });
    }
  }, [hydrated, accessToken, refreshToken, navigate]);

  if (!hydrated || !accessToken || !refreshToken) {
    return null;
  }

  return (
    <div className={MOBILE_SHELL}>
      <div className={MOBILE_FRAME} style={GRADIENT_BG_STYLE} data-mobile-frame>
        <MobileGlassBackdrop />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
        <BottomTabNav />
        <div data-overlay-root className="pointer-events-none absolute inset-0 z-[90]" aria-hidden />
      </div>
    </div>
  );
}
