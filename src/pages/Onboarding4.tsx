import { OnboardingScreen } from '../components/onboarding/OnboardingScreen';
import { ONBOARDING_STEPS } from '../components/onboarding/onboardingCopy';

const step = ONBOARDING_STEPS[3];

/** 온보딩 Step 4/4 — 프리미엄 비주얼 + CTA */
const Onboarding4 = () => (
  <OnboardingScreen
    step={step.step}
    variant={step.variant}
    title={step.title}
    description={step.description}
    nextPath={step.nextPath}
    nextLabel={step.nextLabel}
    isFinal
    showSkip={false}
  />
);

export default Onboarding4;
