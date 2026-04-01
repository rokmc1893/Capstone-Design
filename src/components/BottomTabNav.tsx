import { useLocation, useNavigate } from 'react-router-dom';
import { TapCounsel } from './TapCounsel';
import { BsBullseye, BsHouse, BsPeople } from './BootstrapTabIcons';

export type TabKey = 'home' | 'missions' | 'community';

type TabIconComponent = typeof BsHouse;

const tabs: Array<{ key: TabKey; label: string; Icon: TabIconComponent }> = [
  { key: 'home', label: '홈', Icon: BsHouse },
  { key: 'missions', label: '미션', Icon: BsBullseye },
  { key: 'community', label: '커뮤니티', Icon: BsPeople },
];

function getSelectedTab(pathname: string): TabKey {
  /** 검사하기·시뮬레이터는 홈 흐름 → '홈' 활성 */
  if (pathname === '/simulator' || pathname === '/inspection') return 'home';
  if (pathname === '/missions') return 'missions';
  if (pathname === '/community') return 'community';
  return 'home';
}

/** 홈 / 미션(시뮬레이터) / 커뮤니티 — 현재 경로에 맞춰 활성 탭만 강조 */
export function BottomTabNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTab = getSelectedTab(location.pathname);

  return (
    <div className="absolute bottom-8 left-1/2 z-20 w-[360px] -translate-x-1/2">
      <TapCounsel className="w-full h-[64px]">
        <div className="grid grid-cols-3 h-full items-center">
          {tabs.map((t) => {
            const active = t.key === selectedTab;
            const Icon = t.Icon;
            return (
              <button
                key={t.key}
                type="button"
                className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#9388FA]' : 'text-[#9A9A98]'
                }`}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  if (t.key === 'home') navigate('/home');
                  if (t.key === 'missions') navigate('/missions');
                  if (t.key === 'community') navigate('/community');
                }}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active ? 'opacity-100' : 'opacity-60'
                  }`}
                />
                <span
                  className={`text-[8px] leading-[22px] tracking-[-0.08px] ${
                    active ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </TapCounsel>
    </div>
  );
}
