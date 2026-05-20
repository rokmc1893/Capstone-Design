import { memo } from 'react';
import { Flag, UserX } from 'lucide-react';
import { formatCommunityDate } from '../../../lib/communityFormat';
import { renderSimpleMarkdown } from '../../../lib/community/simpleMarkdown';
import type { CommunityPost } from '../../../types/community';
import { glassCard } from '../../ui/glassStyles';
import { typeCaption, typeCardTitle } from '../../../lib/typography';
import { BookmarkButton } from '../shared/BookmarkButton';
import { CategoryBadge } from '../shared/CategoryBadge';
import { LikeButton } from '../shared/LikeButton';
import { UserAvatar } from '../shared/UserAvatar';

const SURFACE = `${glassCard} px-4 py-4`;

type PostContentProps = {
  post: CommunityPost;
  liked: boolean;
  bookmarked: boolean;
  isAuthor: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReportClick?: () => void;
  onBlockAuthor?: () => void;
};

export const PostContent = memo(function PostContent({
  post,
  liked,
  bookmarked,
  isAuthor,
  onToggleLike,
  onToggleBookmark,
  onEdit,
  onDelete,
  onReportClick,
  onBlockAuthor,
}: PostContentProps) {
  return (
    <article className={SURFACE}>
      <div className="flex items-start gap-3">
        <UserAvatar name={post.authorNickname} />
        <div className="min-w-0 flex-1">
          <p className={`${typeCaption} font-semibold text-white/85`}>{post.authorNickname}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CategoryBadge category={post.category} />
            <span className={`tabular-nums ${typeCaption} text-white/50`}>
              {formatCommunityDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <h2 className={`mt-4 ${typeCardTitle} text-[18px]`}>{post.title}</h2>
      <div className="mt-3 text-[14px] leading-relaxed text-white/88">
        {renderSimpleMarkdown(post.body)}
      </div>

      {post.imageDataUrl ? (
        <img
          src={post.imageDataUrl}
          alt=""
          className="mt-4 max-h-64 w-full rounded-[16px] object-cover ring-1 ring-white/20"
          loading="lazy"
        />
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] text-white/75">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
        <LikeButton count={post.likeUserIds.length} active={liked} onToggle={onToggleLike} />
        <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {isAuthor ? (
          <>
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white/90 transition active:scale-[0.97]"
              >
                수정
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-full bg-rose-400/20 px-3 py-1.5 text-[12px] font-semibold text-rose-100 transition active:scale-[0.97]"
              >
                삭제
              </button>
            ) : null}
          </>
        ) : (
          <>
            {onReportClick ? (
              <button
                type="button"
                onClick={onReportClick}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white/70 transition active:scale-[0.97] active:bg-white/15"
              >
                <Flag className="h-3.5 w-3.5" aria-hidden />
                신고
              </button>
            ) : null}
            {onBlockAuthor ? (
              <button
                type="button"
                onClick={onBlockAuthor}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white/70 transition active:scale-[0.97] active:bg-white/15"
              >
                <UserX className="h-3.5 w-3.5" aria-hidden />
                작성자 차단
              </button>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
});
