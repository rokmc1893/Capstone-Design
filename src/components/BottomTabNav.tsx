import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Target, Users } from 'lucide-react';
import { TapCounsel } from './TapCounsel';
import { glassNavPill } from './ui/glassStyles';
import { springPremium } from '../lib/motionPresets';
import { typeNavLabel } from '../lib/typography';

/** 탭 pill·아이콘 — 레이아웃 고정 후 빠른 전환만 */
const springTab: typeof springPremium = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.7,
};

export type TabKey = 'home' | 'missions' | 'community';

type TabDef = {
  key: TabKey;
  label: string;
  Icon: typeof Home;
};

const tabs: TabDef[] = [
  { key: 'home', label: '홈', Icon: Home },
  { key: 'missions', label: '미션', Icon: Target },
  { key: 'community', label: '커뮤니티', Icon: Users },
];

function getSelectedTab(pathname: string): TabKey {
  if (
    pathname === '/app' ||
    pathname === '/simulator' ||
    pathname === '/inspection' ||
    pathname.startsWith('/inspection-reports')
  ) {
    return 'home';
  }
  if (pathname === '/missions' || pathname.startsWith('/missions/')) return 'missions';
  if (pathname === '/community' || pathname.startsWith('/community/')) return 'community';
  return 'home';
}

export function BottomTabNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTab = getSelectedTab(location.pathname);

  return (
    <nav className="absolute inset-x-6 bottom-10 z-20" aria-label="하단 메뉴">
      <TapCounsel className={`scroll-chrome-nav ${glassNavPill}`}>
        <div className="relative grid h-full grid-cols-3 items-center">
          {tabs.map((t) => {
            const active = t.key === selectedTab;
            const Icon = t.Icon;
            return (
              <button
                key={t.key}
                type="button"
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 ${
                  active ? 'text-[#FF3AA7]' : 'text-[#8E8E93]'
                }`}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  if (t.key === 'home') navigate('/app');
                  if (t.key === 'missions') navigate('/missions');
                  if (t.key === 'community') navigate('/community');
                }}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-tab-pill"
                    className="pointer-events-none absolute inset-x-2.5 top-1.5 bottom-1.5 rounded-[20px] bg-[#FF3AA7]/6 shadow-[0_0_6px_rgba(255,58,167,0.1)]"
                    transition={springTab}
                    aria-hidden
                  />
                ) : null}
                <motion.span
                  className="relative z-[1] flex flex-col items-center gap-0.5"
                  animate={{
                    scale: active ? 1.02 : 1,
                    opacity: active ? 1 : 0.62,
                  }}
                  transition={springTab}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      active ? 'drop-shadow-[0_0_4px_rgba(255,58,167,0.2)]' : ''
                    }`}
                    strokeWidth={active ? 2.25 : 1.85}
                  />
                  <span
                    className={`${typeNavLabel} ${
                      active ? 'font-semibold text-[#FF3AA7]' : 'font-medium text-[#8E8E93]'
                    }`}
                  >
                    {t.label}
                  </span>
                  <motion.span
                    className="h-1 w-1 rounded-full bg-[#FF3AA7]"
                    animate={{
                      scale: active ? 1 : 0,
                      opacity: active ? 1 : 0,
                    }}
                    transition={springTab}
                    style={{ boxShadow: active ? '0 0 3px rgba(255,58,167,0.28)' : 'none' }}
                  />
                </motion.span>
              </button>
            );
          })}
        </div>
      </TapCounsel>
    </nav>
  );
}
