import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { premiumEase, usePremiumMotion } from '../../lib/motionPresets';

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'button';
  onClick?: () => void;
  /** 목록 진입 시 fade */
  index?: number;
};

/**
 * glass 카드 — 호버 breathing·탭 스케일 (모션 최소화 옵션 포함)
 */
export function PremiumCard({
  children,
  className = '',
  as = 'div',
  onClick,
  index = 0,
}: PremiumCardProps) {
  const { reduce, cardHover, cardTap } = usePremiumMotion();
  const Component = motion[as];

  return (
    <Component
      type={as === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={['premium-card', className].filter(Boolean).join(' ')}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.05, 0.2),
        ease: premiumEase,
      }}
      whileHover={reduce ? undefined : cardHover}
      whileTap={reduce ? undefined : cardTap}
    >
      {children}
    </Component>
  );
}
