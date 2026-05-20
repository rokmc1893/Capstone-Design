import { memo } from 'react';
import { Search } from 'lucide-react';
import type { CommunitySortKey } from '../../types/community';
import { typeCaption } from '../../lib/typography';

const SORT_OPTIONS: { id: CommunitySortKey; label: string }[] = [
  { id: 'latest', label: '최신순' },
  { id: 'popular', label: '인기순' },
  { id: 'comments', label: '댓글많은순' },
];

type PostFiltersProps = {
  search: string;
  sort: CommunitySortKey;
  onSearchChange: (value: string) => void;
  onSortChange: (value: CommunitySortKey) => void;
};

export const PostFilters = memo(function PostFilters({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: PostFiltersProps) {
  return (
    <div className="mt-3 space-y-2">
      <label className="relative block">
        <span className="sr-only">게시글 검색</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="제목, 내용, 태그 검색"
          className="w-full rounded-[14px] border border-white/25 bg-white/10 py-2.5 pl-10 pr-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        />
      </label>
      <div className="flex items-center justify-between gap-2">
        <span className={typeCaption}>정렬</span>
        <div className="flex gap-1.5" role="group" aria-label="정렬 방식">
          {SORT_OPTIONS.map((opt) => {
            const active = opt.id === sort;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSortChange(opt.id)}
                className={[
                  'rounded-full px-3 py-1.5 text-[12px] font-semibold transition',
                  active ? 'bg-white/90 text-[#7B6EE8]' : 'bg-white/12 text-white/75',
                ].join(' ')}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
