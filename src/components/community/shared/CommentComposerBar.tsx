import { memo, useEffect, useRef } from 'react';

type CommentComposerBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export const CommentComposerBar = memo(function CommentComposerBar({
  value,
  onChange,
  onSubmit,
  placeholder = '댓글 달기…',
  autoFocus = false,
}: CommentComposerBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit();
  };

  return (
    <form
      className="flex items-center gap-2 border-t border-white/15 pt-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={800}
        className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        aria-label="댓글 입력"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="shrink-0 text-[14px] font-semibold text-white/90 transition disabled:cursor-not-allowed disabled:text-white/35 active:opacity-80"
      >
        게시
      </button>
    </form>
  );
});
