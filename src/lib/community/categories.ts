import type { CommunityCategory, CommunityCategoryFilter } from '../../types/community';

export type CategoryTabDef = {
  id: CommunityCategoryFilter;
  label: string;
  emoji: string;
};

export const COMMUNITY_CATEGORY_TABS: CategoryTabDef[] = [
  { id: 'all', label: '전체', emoji: '📋' },
  { id: 'routine', label: '운동 루틴', emoji: '💪' },
  { id: 'nutrition', label: '식단·영양', emoji: '🥗' },
  { id: 'qa', label: '질문', emoji: '❓' },
  { id: 'progress', label: '진척도', emoji: '📈' },
  { id: 'motivation', label: '성공 스토리', emoji: '🎉' },
];

const CATEGORY_META: Record<
  CommunityCategory,
  { label: string; emoji: string; chipClass: string }
> = {
  routine: {
    label: '운동 루틴',
    emoji: '💪',
    chipClass: 'bg-[#7B6EE8]/25 text-white ring-1 ring-white/30',
  },
  nutrition: {
    label: '식단·영양',
    emoji: '🥗',
    chipClass: 'bg-emerald-400/25 text-white ring-1 ring-white/30',
  },
  qa: {
    label: '질문',
    emoji: '❓',
    chipClass: 'bg-sky-400/25 text-white ring-1 ring-white/30',
  },
  progress: {
    label: '진척도',
    emoji: '📈',
    chipClass: 'bg-amber-400/25 text-white ring-1 ring-white/30',
  },
  motivation: {
    label: '성공 스토리',
    emoji: '🎉',
    chipClass: 'bg-[#FF3AA7]/25 text-white ring-1 ring-white/30',
  },
};

export function isCommunityCategory(value: unknown): value is CommunityCategory {
  return (
    value === 'routine' ||
    value === 'nutrition' ||
    value === 'qa' ||
    value === 'progress' ||
    value === 'motivation'
  );
}

export function getCategoryMeta(category: CommunityCategory) {
  return CATEGORY_META[category];
}

export const SUGGESTED_TAGS = [
  '헬스',
  '다이어트',
  '초보',
  '홈트',
  '유산소',
  '식단',
  '수면',
  '스트레칭',
  '챌린지',
] as const;
