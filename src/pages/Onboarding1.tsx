import { OnboardingScreen } from '../components/onboarding/OnboardingScreen';
import { ONBOARDING_STEPS } from '../components/onboarding/onboardingCopy';

const step = ONBOARDING_STEPS[0];

const Onboarding1 = () => (
  <OnboardingScreen
    step={step.step}
    variant={step.variant}
    title={step.title}
    description={step.description}
    nextPath={step.nextPath}
  />
);

export default Onboarding1;
