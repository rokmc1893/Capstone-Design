import { useEffect } from 'react';
import type { PremiumScrollState } from './usePremiumScrollState';

/** 스크롤 상태 → body 클래스 (네비·헤더 glass 반응) */
export function useScrollBodyChrome(state: Pick<PremiumScrollState, 'isScrolling' | 'isScrolled'>) {
  useEffect(() => {
    document.body.classList.toggle('app-is-scrolling', state.isScrolling);
    document.body.classList.toggle('app-is-scrolled', state.isScrolled);
    return () => {
      document.body.classList.remove('app-is-scrolling', 'app-is-scrolled');
    };
  }, [state.isScrolling, state.isScrolled]);
}
