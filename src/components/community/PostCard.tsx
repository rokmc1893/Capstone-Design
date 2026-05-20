import { memo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCommunityDate } from '../../lib/communityFormat';
import {
  typeCommunityPostAuthor,
  typeCommunityPostBody,
  typeCommunityPostMeta,
  typeCommunityPostTag,
  typeCommunityPostTitle,
} from '../../lib/typography';
import type { CommunityPost } from '../../types/community';
import { glassCommunityPostCard, glassCommunityPostCardPadding } from '../ui/glassStyles';
import { communityEaseSoft } from '../../lib/community/interactionMotion';
import { BookmarkButton } from './shared/BookmarkButton';
import { CategoryBadge } from './shared/CategoryBadge';
import { CommentActionButton } from './shared/CommentActionButton';
import { CommentComposerBar } from './shared/CommentComposerBar';
import { LikeButton } from './shared/LikeButton';
import { UserAvatar } from './shared/UserAvatar';

const SURFACE = `premium-card ${glassCommunityPostCard} ${glassCommunityPostCardPadding}`;
const TAG_CHIP =
  'rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-1';

type PostCardProps = {
  post: CommunityPost;
  commentCount: number;
  liked: boolean;
  bookmarked: boolean;
  onOpen: () => void;
  onToggleLike: () => void;
  onToggleBookmark: (anchor: HTMLElement) => void;
  onCommentIntent?: (openComposer: () => void, anchor: HTMLElement) => void;
  onAddComment: (body: string) => void;
};

export const PostCard = memo(function PostCard({
  post,
  commentCount,
  liked,
  bookmarked,
  onOpen,
  onToggleLike,
  onToggleBookmark,
  onCommentIntent,
  onAddComment,
}: PostCardProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    const body = commentText.trim();
    if (!body) return;
    onAddComment(body);
    setCommentText('');
    setComposerOpen(false);
  };

  return (
    <article className={SURFACE}>
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-start gap-4">
          <UserAvatar name={post.authorNickname} size="sm" />
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

        {post.imageDataUrl ? (
          <img
            src={post.imageDataUrl}
            alt=""
            className="mt-6 h-40 w-full rounded-[18px] object-cover ring-1 ring-white/16"
            loading="lazy"
          />
        ) : null}

        <h2
          className={`line-clamp-2 ${post.imageDataUrl ? 'mt-6' : 'mt-7'} ${typeCommunityPostTitle}`}
        >
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 ${typeCommunityPostBody}`}>{post.body}</p>

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className={`${TAG_CHIP} ${typeCommunityPostTag}`}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.12] pt-5">
        <div className="flex items-center gap-1">
          <LikeButton count={post.likeUserIds.length} active={liked} onToggle={onToggleLike} />
          <CommentActionButton
            count={commentCount}
            active={composerOpen}
            onClick={(anchor) => {
              if (composerOpen) {
                setComposerOpen(false);
                return;
              }
              const open = () => setComposerOpen(true);
              if (onCommentIntent) onCommentIntent(open, anchor);
              else open();
            }}
          />
        </div>
        <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
      </div>

      <AnimatePresence initial={false}>
        {composerOpen ? (
          <motion.div
            key="composer"
            className="mt-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: communityEaseSoft }}
          >
            <CommentComposerBar
              value={commentText}
              onChange={setCommentText}
              onSubmit={submitComment}
              autoFocus
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
});
