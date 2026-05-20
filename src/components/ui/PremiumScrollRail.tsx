import { useEffect, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';

type RailMetrics = {
  thumbTop: number;
  thumbHeight: number;
  show: boolean;
};

function measure(el: HTMLDivElement): RailMetrics {
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight + 2) {
    return { thumbTop: 0, thumbHeight: 0, show: false };
  }
  const ratio = clientHeight / scrollHeight;
  const thumbHeight = Math.max(28, clientHeight * ratio);
  const track = clientHeight - thumbHeight;
  const thumbTop = track <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * track;
  return { thumbTop, thumbHeight, show: true };
}

type PremiumScrollRailProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  isScrolling: boolean;
  axis?: 'y' | 'x';
};

/** 우측 glass scrollbar — 스크롤 중 fade in, 정지 시 fade out */
export function PremiumScrollRail({
  containerRef,
  isScrolling,
  axis = 'y',
}: PremiumScrollRailProps) {
  const [metrics, setMetrics] = useState<RailMetrics>({
    thumbTop: 0,
    thumbHeight: 0,
    show: false,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || axis !== 'y') return;

    const update = () => setMetrics(measure(el));
    update();

    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [containerRef, axis]);

  if (!metrics.show) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-y-2 right-1.5 z-[4] w-1"
      aria-hidden
      initial={false}
      animate={{ opacity: isScrolling ? 1 : 0 }}
      transition={{
        opacity: {
          duration: isScrolling ? 0.22 : 0.48,
          delay: isScrolling ? 0 : 0.12,
          ease: [0.2, 0.8, 0.2, 1],
        },
      }}
    >
      <motion.div
        className="absolute right-0 w-[3px] rounded-full bg-white/25 shadow-[0_0_8px_rgba(255,255,255,0.15)] backdrop-blur-sm"
        style={{
          top: metrics.thumbTop,
          height: metrics.thumbHeight,
        }}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
      />
    </motion.div>
  );
}
