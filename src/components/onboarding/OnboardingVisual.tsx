import type { ReactElement } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { OnboardingVisualVariant } from './onboardingCopy';

const premiumEase = [0.2, 0.8, 0.2, 1] as const;
const floatEase = [0.45, 0, 0.55, 1] as const;

function FloatingParticle({
  cx,
  cy,
  r,
  delay,
  reduce,
}: {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  reduce: boolean;
}) {
  if (reduce) {
    return <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.35)" />;
  }
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="rgba(255,255,255,0.35)"
      initial={{ opacity: 0.2, y: 0 }}
      animate={{
        opacity: [0.25, 0.55, 0.25],
        y: [0, -6, 0],
      }}
      transition={{
        duration: 4.2 + delay * 0.4,
        repeat: Infinity,
        ease: floatEase,
        delay,
      }}
    />
  );
}

/** 심박 파형 — 얇은 stroke, 은은한 gradient */
function PulseWave({ y = 168, reduce }: { y?: number; reduce: boolean }) {
  const path =
    'M 52 ' +
    y +
    ' Q 88 ' +
    (y - 14) +
    ' 108 ' +
    y +
    ' T 148 ' +
    (y - 6) +
    ' T 188 ' +
    y +
    ' T 228 ' +
    (y - 10) +
    ' T 268 ' +
    y;

  if (reduce) {
    return (
      <path
        d={path}
        fill="none"
        stroke="url(#onb-wave)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  }

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="url(#onb-wave)"
      strokeWidth="1.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0.4 }}
      animate={{ pathLength: 1, opacity: [0.45, 0.85, 0.45] }}
      transition={{
        pathLength: { duration: 1.8, ease: premiumEase },
        opacity: { duration: 3.2, repeat: Infinity, ease: floatEase },
      }}
    />
  );
}

function GlassSphere({
  size = 120,
  cx = 140,
  cy = 140,
  reduce,
}: {
  size?: number;
  cx?: number;
  cy?: number;
  reduce: boolean;
}) {
  const r = size / 2;
  const content = (
    <>
      <circle cx={cx} cy={cy} r={r + 18} fill="url(#onb-orb-glow)" opacity={0.55} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="url(#onb-glass-fill)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
      />
      <ellipse
        cx={cx - r * 0.28}
        cy={cy - r * 0.32}
        rx={r * 0.42}
        ry={r * 0.22}
        fill="rgba(255,255,255,0.38)"
        opacity={0.85}
      />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="url(#onb-orb-inner)" />
    </>
  );

  if (reduce) return <g>{content}</g>;

  return (
    <motion.g
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: floatEase }}
    >
      {content}
    </motion.g>
  );
}

function SignalsVisual({ reduce }: { reduce: boolean }) {
  return (
    <>
      <FloatingParticle cx={48} cy={52} r={3} delay={0} reduce={reduce} />
      <FloatingParticle cx={228} cy={68} r={2.5} delay={0.6} reduce={reduce} />
      <FloatingParticle cx={252} cy={200} r={2} delay={1.2} reduce={reduce} />
      <GlassSphere size={108} reduce={reduce} />
      <circle cx={200} cy={88} r={22} fill="url(#onb-orb-accent)" opacity={0.75} />
      <circle cx={72} cy={196} r={14} fill="rgba(255,255,255,0.22)" />
    </>
  );
}

function MomentVisual({ reduce }: { reduce: boolean }) {
  return (
    <>
      <FloatingParticle cx={56} cy={78} r={2.5} delay={0.3} reduce={reduce} />
      <FloatingParticle cx={236} cy={44} r={3} delay={0.9} reduce={reduce} />
      <circle cx={140} cy={132} r={72} fill="url(#onb-orb-glow)" opacity={0.5} />
      <circle
        cx={140}
        cy={132}
        r={56}
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
      />
      <circle
        cx={140}
        cy={132}
        r={40}
        fill="url(#onb-glass-fill)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1"
      />
      <PulseWave y={168} reduce={reduce} />
      <circle cx={196} cy={108} r={10} fill="rgba(255,255,255,0.3)" />
    </>
  );
}

function RhythmVisual({ reduce }: { reduce: boolean }) {
  const arcPath = 'M 72 200 Q 110 120 140 148 T 208 108';
  const Arc = reduce ? 'path' : motion.path;

  return (
    <>
      <FloatingParticle cx={44} cy={120} r={2} delay={0.5} reduce={reduce} />
      <FloatingParticle cx={248} cy={168} r={2.5} delay={1} reduce={reduce} />
      <circle cx={140} cy={150} r={80} fill="url(#onb-orb-glow)" opacity={0.45} />
      <Arc
        d={arcPath}
        fill="none"
        stroke="url(#onb-wave)"
        strokeWidth="2"
        strokeLinecap="round"
        {...(reduce
          ? { opacity: 0.75 }
          : {
              initial: { pathLength: 0, opacity: 0.5 },
              animate: { pathLength: 1, opacity: [0.55, 0.9, 0.55] },
              transition: {
                pathLength: { duration: 2, ease: premiumEase },
                opacity: { duration: 3.5, repeat: Infinity, ease: floatEase },
              },
            })}
      />
      {[108, 140, 172].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={200 - i * 28}
          r={5 + i * 1.5}
          fill="rgba(255,255,255,0.35)"
          opacity={0.5 + i * 0.15}
        />
      ))}
      <GlassSphere size={52} cx={140} cy={198} reduce={reduce} />
    </>
  );
}

function BeginVisual({ reduce }: { reduce: boolean }) {
  const glowRing = <circle cx={140} cy={148} r={100} fill="url(#onb-orb-glow)" />;

  return (
    <>
      <FloatingParticle cx={36} cy={100} r={2.5} delay={0} reduce={reduce} />
      <FloatingParticle cx={250} cy={90} r={3} delay={0.7} reduce={reduce} />
      <FloatingParticle cx={220} cy={230} r={2} delay={1.4} reduce={reduce} />
      <FloatingParticle cx={60} cy={220} r={2.5} delay={2} reduce={reduce} />
      {reduce ? (
        <g>{glowRing}</g>
      ) : (
        <motion.g
          animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: floatEase }}
        >
          {glowRing}
        </motion.g>
      )}
      <GlassSphere size={128} reduce={reduce} />
      <PulseWave y={220} reduce={reduce} />
      <circle
        cx={140}
        cy={148}
        r={148}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
    </>
  );
}

const VISUALS: Record<
  OnboardingVisualVariant,
  (props: { reduce: boolean }) => ReactElement
> = {
  signals: SignalsVisual,
  moment: MomentVisual,
  rhythm: RhythmVisual,
  begin: BeginVisual,
};

interface OnboardingVisualProps {
  variant: OnboardingVisualVariant;
  className?: string;
}

export function OnboardingVisual({ variant, className = '' }: OnboardingVisualProps) {
  const reduce = Boolean(useReducedMotion());
  const Visual = VISUALS[variant];

  return (
    <div
      className={`relative mx-auto w-full max-w-[280px] overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 280 280"
        className="mx-auto h-auto max-h-full w-full drop-shadow-[0_24px_48px_rgba(88,72,160,0.18)]"
        role="presentation"
      >
        <defs>
          <linearGradient id="onb-orb-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(232,164,200,0.25)" />
          </linearGradient>
          <radialGradient id="onb-orb-inner" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="55%" stopColor="rgba(183,148,244,0.35)" />
            <stop offset="100%" stopColor="rgba(155,140,248,0.2)" />
          </radialGradient>
          <radialGradient id="onb-orb-accent" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(232,164,200,0.15)" />
          </radialGradient>
          <linearGradient id="onb-glass-fill" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(183,148,244,0.18)" />
          </linearGradient>
          <linearGradient id="onb-wave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>
        </defs>
        <Visual reduce={reduce} />
      </svg>
    </div>
  );
}
