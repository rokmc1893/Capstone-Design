import { memo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Flame, LayoutGrid } from 'lucide-react';
import type { CommunityFeedTab } from '../../types/community';

const FEED_TABS: {
  id: CommunityFeedTab;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: 'all', label: '전체 글', icon: LayoutGrid },
  { id: 'popular', label: '인기 글', icon: Flame },
  { id: 'saved', label: '저장한 글', icon: Bookmark },
];

type CommunityFeedTabsProps = {
  value: CommunityFeedTab;
  onChange: (value: CommunityFeedTab) => void;
};

export const CommunityFeedTabs = memo(function CommunityFeedTabs({
  value,
  onChange,
}: CommunityFeedTabsProps) {
  return (
    <div
      className="flex gap-2 rounded-[18px] border border-white/20 bg-white/[0.08] p-1 backdrop-blur-md"
      role="tablist"
      aria-label="게시글 보기"
    >
      {FEED_TABS.map((tab) => {
        const active = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[14px] py-3 transition active:scale-[0.98]"
          >
            {active ? (
              <motion.span
                layoutId="community-feed-tab"
                className="absolute inset-0 rounded-[14px] bg-white shadow-[0_4px_14px_rgba(123,110,232,0.18)]"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-1">
              <Icon
                className={`h-3.5 w-3.5 ${active ? 'text-[#7B6EE8]' : 'text-white/65'}`}
                strokeWidth={2}
                aria-hidden
              />
              <span
                className={`text-[12px] font-semibold tracking-[-0.02em] ${
                  active ? 'text-[#7B6EE8]' : 'text-white/78'
                }`}
              >
                {tab.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
});
