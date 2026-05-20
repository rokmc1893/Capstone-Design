import { Outlet } from 'react-router-dom';
import { BottomTabNav } from '../components/BottomTabNav';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import { GRADIENT_BG_STYLE, MOBILE_FRAME, MOBILE_SHELL } from '../components/ui/glassStyles';

/** 홈·미션·커뮤니티 — 하단 탭을 라우트 전환 시에도 유지 */
export function MainTabLayout() {
  return (
    <div className={MOBILE_SHELL}>
      <div className={MOBILE_FRAME} style={GRADIENT_BG_STYLE}>
        <MobileGlassBackdrop />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
        <BottomTabNav />
      </div>
    </div>
  );
}
