import { memo } from 'react';
import { getCategoryMeta } from '../../../lib/community/categories';
import type { CommunityCategory } from '../../../types/community';

type CategoryBadgeProps = {
  category: CommunityCategory;
  compact?: boolean;
};

export const CategoryBadge = memo(function CategoryBadge({
  category,
  compact,
}: CategoryBadgeProps) {
  const meta = getCategoryMeta(category);
  return (
    <span
      className={
        compact
          ? 'inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-white/65'
          : `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.chipClass}`
      }
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
});
