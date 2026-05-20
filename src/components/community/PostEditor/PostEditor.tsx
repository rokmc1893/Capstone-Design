import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { COMMUNITY_CATEGORY_TABS } from '../../../lib/community/categories';
import { renderSimpleMarkdown } from '../../../lib/community/simpleMarkdown';
import {
  POST_BODY_MAX,
  POST_TITLE_MAX,
  sanitizePlainText,
} from '../../../lib/community/sanitize';
import type { CommunityCategory, CommunityPost, CreatePostPayload } from '../../../types/community';
import { glassCard } from '../../ui/glassStyles';
import { typeCardTitle } from '../../../lib/typography';
import { ImageUpload } from './ImageUpload';
import { TagInput } from './TagInput';

const SURFACE = `${glassCard} px-4 py-4`;

type PostEditorProps = {
  initial?: CommunityPost;
  onSubmit: (payload: Omit<CreatePostPayload, 'authorNickname'>) => void;
  onCancel: () => void;
};

export function PostEditor({ initial, onSubmit, onCancel }: PostEditorProps) {
  const [category, setCategory] = useState<CommunityCategory>(initial?.category ?? 'routine');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [tagRaw, setTagRaw] = useState(initial?.tags.map((t) => `#${t}`).join(' ') ?? '');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(initial?.imageDataUrl);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = COMMUNITY_CATEGORY_TABS.filter((t) => t.id !== 'all');

  const handleSubmit = () => {
    const t = sanitizePlainText(title, POST_TITLE_MAX);
    const b = sanitizePlainText(body, POST_BODY_MAX);
    if (!t || !b) {
      setError('제목과 본문을 모두 입력해 주세요.');
      return;
    }
    onSubmit({ category, title: t, body: b, tags, imageDataUrl });
  };

  return (
    <div className="space-y-4">
      <section className={SURFACE}>
        <p className={typeCardTitle}>카테고리</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id as CommunityCategory)}
              className={[
                'rounded-full px-3 py-2 text-[12px] font-semibold',
                category === c.id ? 'bg-white text-[#7B6EE8]' : 'bg-white/12 text-white/80',
              ].join(' ')}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className={SURFACE}>
        <label className="text-[13px] font-semibold text-white/85" htmlFor="post-title">
          제목 ({title.length}/{POST_TITLE_MAX})
        </label>
        <input
          id="post-title"
          value={title}
          maxLength={POST_TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="mt-2 w-full rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        />

        <label className="mt-4 block text-[13px] font-semibold text-white/85" htmlFor="post-body">
          본문 (마크다운: **굵게**, 줄 목록 `- `)
        </label>
        <textarea
          id="post-body"
          value={body}
          maxLength={POST_BODY_MAX}
          rows={8}
          onChange={(e) => setBody(e.target.value)}
          placeholder="경험, 루틴, 질문을 자유롭게 적어 주세요"
          className="mt-2 w-full resize-none rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        />

        <TagInput value={tagRaw} tags={tags} onValueChange={setTagRaw} onTagsChange={setTags} />
        <div className="mt-4">
          <ImageUpload value={imageDataUrl} onChange={setImageDataUrl} />
        </div>

        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-white/80"
        >
          {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {preview ? '미리보기 닫기' : '미리보기'}
        </button>

        {preview ? (
          <div className="mt-3 rounded-[14px] border border-white/20 bg-white/8 p-4 text-[14px] text-white/90">
            <p className="text-[16px] font-bold">{title || '(제목 없음)'}</p>
            <div className="mt-3">{renderSimpleMarkdown(body || '(본문 없음)')}</div>
          </div>
        ) : null}

        {error ? <p className="mt-3 text-[12px] text-rose-200">{error}</p> : null}
      </section>

      <div className="flex gap-2 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-[14px] bg-white/15 py-3.5 text-[14px] font-semibold text-white/90"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-[14px] bg-white/90 py-3.5 text-[14px] font-semibold text-[#7B6EE8]"
        >
          {initial ? '수정 완료' : '등록'}
        </button>
      </div>
    </div>
  );
}
