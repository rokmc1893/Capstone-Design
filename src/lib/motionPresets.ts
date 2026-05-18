import { useReducedMotion, type Transition, type Variants } from 'framer-motion';

export const premiumEase = [0.2, 0.8, 0.2, 1] as const;

export const springPremium: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
  mass: 0.85,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: premiumEase },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const staggerSection: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const cardLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -5, scale: 1.01 },
  tap: { y: -1, scale: 0.98 },
};

/** prefers-reduced-motion 시 애니메이션 최소화 */
export function usePremiumMotion() {
  const reduce = useReducedMotion();
  return {
    reduce: Boolean(reduce),
    variants: reduce ? fadeUpReduced : fadeUp,
    stagger: reduce ? undefined : staggerSection,
    spring: reduce ? ({ duration: 0.15 } as Transition) : springPremium,
    cardHover: reduce ? {} : { y: -5, scale: 1.01 },
    cardTap: reduce ? {} : { scale: 0.98 },
  };
}
