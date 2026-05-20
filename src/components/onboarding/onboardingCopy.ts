/** 온보딩 — 감성 케어 톤 카피 (기능 설명형 지양) */

export type OnboardingVisualVariant = 'signals' | 'moment' | 'rhythm' | 'begin';

export const ONBOARDING_STEPS = [
  {
    step: 1 as const,
    variant: 'signals' as OnboardingVisualVariant,
    title: '몸의 작은 신호도\n소중해요',
    description:
      '내 몸은 이미 조용히\n이야기하고 있어요\n오늘의 나를 천천히 살펴보세요',
    nextPath: '/onboarding/2',
  },
  {
    step: 2 as const,
    variant: 'moment' as OnboardingVisualVariant,
    title: '오늘의 컨디션을\n살펴보세요',
    description:
      '부담 없는 한 번의 확인으로\n지금 이 순간의 나를\n가볍게 돌아봐요',
    nextPath: '/onboarding/3',
  },
  {
    step: 3 as const,
    variant: 'rhythm' as OnboardingVisualVariant,
    title: '건강은 작은 기록에서\n시작돼요',
    description:
      '쌓인 기록이 나만의 리듬이 돼요\n몸이 보내는 흐름을\n함께 들여다봐요',
    nextPath: '/onboarding/4',
  },
  {
    step: 4 as const,
    variant: 'begin' as OnboardingVisualVariant,
    title: '이제, 천천히\n함께 시작해요',
    description:
      '스스로를 돌보는 시간\n오늘부터 가볍게 이어가요',
    nextPath: '/login',
    nextLabel: '시작하기',
    isFinal: true,
  },
] as const;

export const ONBOARDING_SKIP_PATH = '/onboarding/4';
