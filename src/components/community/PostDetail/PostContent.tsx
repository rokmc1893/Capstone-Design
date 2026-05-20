import { memo } from 'react';
import { motion } from 'framer-motion';
import { UserX } from 'lucide-react';
import { formatCommunityDate } from '../../../lib/communityFormat';
import { renderSimpleMarkdown } from '../../../lib/community/simpleMarkdown';
import {
  typeCommunityPostAuthor,
  typeCommunityPostBody,
  typeCommunityPostMeta,
  typeCommunityPostTag,
  typeCommunityPostTitle,
} from '../../../lib/typography';
import type { CommunityPost } from '../../../types/community';
import { glassCommunityPostCard, glassCommunityPostCardPadding } from '../../ui/glassStyles';
import { BookmarkButton } from '../shared/BookmarkButton';
import { CategoryBadge } from '../shared/CategoryBadge';
import { LikeButton } from '../shared/LikeButton';
import { ReportActionButton } from '../shared/ReportActionButton';
import { communitySpringTap } from '../../../lib/community/interactionMotion';
import { UserAvatar } from '../shared/UserAvatar';

const SURFACE = `${glassCommunityPostCard} ${glassCommunityPostCardPadding}`;
const TAG_CHIP =
  'rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-1';

type PostContentProps = {
  post: CommunityPost;
  liked: boolean;
  bookmarked: boolean;
  isAuthor: boolean;
  onToggleLike: () => void;
  onToggleBookmark: (anchor: HTMLElement) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReportClick?: (anchor: HTMLElement) => void;
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
      <div className="flex items-start gap-4">
        <UserAvatar name={post.authorNickname} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={typeCommunityPostAuthor}>{post.authorNickname}</p>
            <CategoryBadge category={post.category} compact />
          </div>
          <p className={`mt-2 tabular-nums ${typeCommunityPostMeta}`}>
            {formatCommunityDate(post.createdAt)}
          </p>
        </div>
      </div>

      <h2 className={`mt-7 ${typeCommunityPostTitle}`}>{post.title}</h2>
      <div className={`mt-4 ${typeCommunityPostBody}`}>{renderSimpleMarkdown(post.body)}</div>

      {post.imageDataUrl ? (
        <img
          src={post.imageDataUrl}
          alt=""
          className="mt-6 max-h-64 w-full rounded-[18px] object-cover ring-1 ring-white/16"
          loading="lazy"
        />
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className={`${TAG_CHIP} ${typeCommunityPostTag}`}>
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.12] pt-5">
        <LikeButton count={post.likeUserIds.length} active={liked} onToggle={onToggleLike} />
        <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {isAuthor ? (
          <>
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-white/12 px-3.5 py-2 text-[12px] font-semibold text-white/88 transition active:scale-[0.97]"
              >
                수정
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-full bg-rose-400/15 px-3.5 py-2 text-[12px] font-semibold text-rose-100/95 transition active:scale-[0.97]"
              >
                삭제
              </button>
            ) : null}
          </>
        ) : (
          <>
            {onReportClick ? <ReportActionButton onClick={onReportClick} /> : null}
            {onBlockAuthor ? (
              <motion.button
                type="button"
                onClick={onBlockAuthor}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/18 bg-white/[0.10] px-3.5 py-2 text-[12px] font-semibold text-white/78 backdrop-blur-md"
                whileTap={{ scale: 0.94 }}
                transition={communitySpringTap}
              >
                <UserX className="h-3.5 w-3.5 text-white/55" aria-hidden />
                작성자 차단
              </motion.button>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
});
