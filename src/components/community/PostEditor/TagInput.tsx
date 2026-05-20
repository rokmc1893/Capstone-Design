import { SUGGESTED_TAGS } from '../../../lib/community/categories';
import { parseTagsInput } from '../../../lib/community/sanitize';

type TagInputProps = {
  value: string;
  tags: string[];
  onValueChange: (raw: string) => void;
  onTagsChange: (tags: string[]) => void;
};

export function TagInput({ value, tags, onValueChange, onTagsChange }: TagInputProps) {
  const applyRaw = (raw: string) => {
    onValueChange(raw);
    onTagsChange(parseTagsInput(raw));
  };

  return (
    <div>
      <label className="text-[13px] font-semibold text-white/85" htmlFor="post-tags">
        태그
      </label>
      <input
        id="post-tags"
        value={value}
        onChange={(e) => applyRaw(e.target.value)}
        placeholder="#헬스 #다이어트 (쉼표·공백 구분)"
        className="mt-2 w-full rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
      />
      {tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] text-white/80">
              #{t}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              const next = tags.includes(tag) ? tags : [...tags, tag];
              applyRaw(next.map((t) => `#${t}`).join(' '));
            }}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/20"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
