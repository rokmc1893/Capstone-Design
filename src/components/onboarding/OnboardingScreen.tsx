import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../StatusBar';
import { GRADIENT_BG_STYLE } from '../ui/glassStyles';
import { usePremiumMotion } from '../../lib/motionPresets';
import {
  ONBOARDING_SKIP_PATH,
  type OnboardingVisualVariant,
} from './onboardingCopy';
import { OnboardingVisual } from './OnboardingVisual';

const TOTAL_STEPS = 4;

interface OnboardingScreenProps {
  step: 1 | 2 | 3 | 4;
  variant: OnboardingVisualVariant;
  title: string;
  description: string;
  nextLabel?: string;
  nextPath: string;
  isFinal?: boolean;
  showSkip?: boolean;
}

export function OnboardingScreen({
  step,
  variant,
  title,
  description,
  nextLabel = '다음으로',
  nextPath,
  isFinal = false,
  showSkip = true,
}: OnboardingScreenProps) {
  const navigate = useNavigate();
  const { variants, stagger, reduce } = usePremiumMotion();

  const goNext = () => {
    if (isFinal) {
      navigate(nextPath, { replace: true });
      return;
    }
    navigate(nextPath);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center max-sm:min-h-[100dvh] max-sm:items-stretch"
      style={GRADIENT_BG_STYLE}
    >
      <div
        className="relative flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] shadow-[0_24px_64px_rgba(120,100,200,0.32)] max-sm:h-[100dvh] max-sm:max-w-none max-sm:rounded-none max-sm:shadow-none"
        style={GRADIENT_BG_STYLE}
      >
        <OnboardingBackdrop />

        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
          {showSkip && !isFinal ? (
            <div className="flex justify-end px-6 pt-2">
              <button
                type="button"
                onClick={() => navigate(ONBOARDING_SKIP_PATH)}
                className="type-onboarding-skip min-h-[44px] px-1 transition active:opacity-60"
              >
                건너뛰기
              </button>
            </div>
          ) : (
            <div className="h-3" aria-hidden />
          )}
        </header>

        <motion.main
          className="relative z-10 flex min-h-0 flex-1 flex-col px-8 pb-10 pt-2 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="flex min-h-0 flex-1 flex-col items-center">
            <motion.div variants={variants} className="w-full pt-6 sm:pt-8">
              <OnboardingVisual variant={variant} />
            </motion.div>

            <motion.h1
              variants={variants}
              className="type-onboarding-headline mt-12 whitespace-pre-line sm:mt-14"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={variants}
              className="type-onboarding-body mt-5 max-w-[300px] whitespace-pre-line sm:mt-6"
            >
              {description}
            </motion.p>
          </div>

          <motion.div variants={variants} className="shrink-0 pt-8">
            <OnboardingIndicators active={step} total={TOTAL_STEPS} />

            <motion.button
              type="button"
              onClick={goNext}
              className={
                isFinal
                  ? 'onboarding-cta-primary mt-8'
                  : 'onboarding-cta-secondary mt-7'
              }
              whileTap={reduce ? undefined : { scale: 0.985 }}
              whileHover={reduce ? undefined : { scale: 1.01 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {nextLabel}
            </motion.button>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

function OnboardingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="onboarding-glow-orb absolute -top-28 left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-white/22 blur-[64px]" />
      <div className="absolute top-[32%] -right-24 h-[280px] w-[280px] rounded-full bg-[#F0B4D4]/40 blur-[72px]" />
      <div className="absolute -bottom-20 -left-20 h-[240px] w-[240px] rounded-full bg-[#9B8CF8]/30 blur-[56px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.14] via-transparent to-white/[0.1]" />
      <div className="onboarding-float-slow absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-white/30" />
      <div className="onboarding-float-delayed absolute right-[18%] top-[42%] h-1.5 w-1.5 rounded-full bg-white/25" />
      <div className="onboarding-float-slow absolute bottom-[28%] left-[22%] h-1.5 w-1.5 rounded-full bg-white/20" />
    </div>
  );
}

function OnboardingIndicators({
  active,
  total,
}: {
  active: number;
  total: number;
}) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="tablist"
      aria-label={`온보딩 ${active}단계`}
    >
      {Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        const isActive = index === active;
        return (
          <motion.span
            key={index}
            role="tab"
            aria-selected={isActive}
            className="block h-2 rounded-full bg-white/50"
            animate={{
              width: isActive ? 24 : 8,
              backgroundColor: isActive
                ? 'rgba(26, 26, 30, 0.88)'
                : 'rgba(255, 255, 255, 0.5)',
            }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          />
        );
      })}
    </div>
  );
}
