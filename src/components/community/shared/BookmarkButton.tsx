import { memo } from 'react';
import { Bookmark } from 'lucide-react';

type BookmarkButtonProps = {
  active: boolean;
  onToggle: () => void;
};

export const BookmarkButton = memo(function BookmarkButton({ active, onToggle }: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95 ${
        active ? 'bg-white/25 text-[#FF3AA7]' : 'bg-white/10 text-white/75'
      }`}
      aria-pressed={active}
      aria-label={active ? '북마크 해제' : '북마크'}
    >
      <Bookmark className="h-4 w-4" fill={active ? 'currentColor' : 'none'} strokeWidth={2} />
    </button>
  );
});
