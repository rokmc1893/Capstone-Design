import { memo } from 'react';
import { MessageCircle } from 'lucide-react';

type CommentActionButtonProps = {
  count: number;
  active?: boolean;
  onClick: () => void;
};

export const CommentActionButton = memo(function CommentActionButton({
  count,
  active = false,
  onClick,
}: CommentActionButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition active:scale-95 ${
        active ? 'text-white' : 'text-white/70'
      }`}
      aria-expanded={active}
      aria-label={`댓글 ${count}개, 댓글 작성`}
    >
      <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
      <span className="text-[12px] font-semibold tabular-nums">{count}</span>
    </button>
  );
});
