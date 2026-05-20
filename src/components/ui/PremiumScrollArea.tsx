import { useEffect, type ReactNode } from 'react';
import {
  usePremiumScrollState,
  type PremiumScrollState,
} from '../../hooks/usePremiumScrollState';
import { PremiumScrollRail } from './PremiumScrollRail';
import { ScrollTopChrome } from './ScrollTopChrome';

type PremiumScrollAreaProps = {
  children: ReactNode;
  className?: string;
  showTopChrome?: boolean;
  /** JS 커스텀 스크롤바 (fade in/out) */
  customRail?: boolean;
  onScrollState?: (state: PremiumScrollState) => void;
};

export function PremiumScrollArea({
  children,
  className = '',
  showTopChrome = false,
  customRail = true,
  onScrollState,
}: PremiumScrollAreaProps) {
  const { ref, onScroll, className: scrollClass, state } = usePremiumScrollState();

  useEffect(() => {
    onScrollState?.(state);
  }, [state, onScrollState]);

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={[
        scrollClass,
        customRail ? 'premium-scroll--custom-rail' : '',
        'relative min-h-0 flex-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {customRail ? (
        <PremiumScrollRail containerRef={ref} isScrolling={state.isScrolling} />
      ) : null}
      {showTopChrome ? <ScrollTopChrome active={state.isScrolled} /> : null}
      {children}
    </div>
  );
}
