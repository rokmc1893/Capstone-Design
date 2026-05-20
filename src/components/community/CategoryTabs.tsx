import { memo } from 'react';
import { COMMUNITY_CATEGORY_TABS } from '../../lib/community/categories';
import type { CommunityCategoryFilter } from '../../types/community';

type CategoryTabsProps = {
  value: CommunityCategoryFilter;
  onChange: (value: CommunityCategoryFilter) => void;
};

export const CategoryTabs = memo(function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="게시글 카테고리"
    >
      {COMMUNITY_CATEGORY_TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={[
              'shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition',
              active
                ? 'bg-white text-[#7B6EE8] shadow-md'
                : 'bg-white/15 text-white/88 ring-1 ring-white/25',
            ].join(' ')}
          >
            <span className="mr-1" aria-hidden>
              {tab.emoji}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});
