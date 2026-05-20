import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollBodyChrome } from './useScrollBodyChrome';

export type PremiumScrollState = {
  isScrolling: boolean;
  isScrolled: boolean;
  scrollTop: number;
};

type Options = {
  /** 스크롤 멈춘 뒤 스크롤바 fade out (ms) */
  scrollEndMs?: number;
  /** 상단 chrome 활성화 임계 (px) */
  scrolledThreshold?: number;
  axis?: 'x' | 'y';
};

/**
 * 스크롤바 fade · 상단 chrome용 상태.
 * ref + onScroll + className을 스크롤 컨테이너에 연결합니다.
 */
export function usePremiumScrollState({
  scrollEndMs = 880,
  scrolledThreshold = 8,
  axis = 'y',
}: Options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const top = axis === 'x' ? el.scrollLeft : el.scrollTop;
    setScrollTop(top);
    setIsScrolled(top > scrolledThreshold);
    setIsScrolling(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsScrolling(false), scrollEndMs);
  }, [scrollEndMs, scrolledThreshold, axis]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const className = [
    axis === 'x' ? 'premium-scroll-x' : 'premium-scroll',
    isScrolling ? 'is-scrolling' : '',
    isScrolled ? 'is-scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const state: PremiumScrollState = { isScrolling, isScrolled, scrollTop };

  useScrollBodyChrome(state);

  return { ref, onScroll, className, state };
}
