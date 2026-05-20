import { memo, useState } from 'react';
import { formatCommunityDate } from '../../lib/communityFormat';
import type { CommunityPost } from '../../types/community';
import { glassCard } from '../ui/glassStyles';
import { typeCaption, typeCardDesc, typeCardTitle } from '../../lib/typography';
import { BookmarkButton } from './shared/BookmarkButton';
import { CategoryBadge } from './shared/CategoryBadge';
import { CommentActionButton } from './shared/CommentActionButton';
import { CommentComposerBar } from './shared/CommentComposerBar';
import { LikeButton } from './shared/LikeButton';
import { UserAvatar } from './shared/UserAvatar';

const SURFACE = `${glassCard} px-4 py-4`;

type PostCardProps = {
  post: CommunityPost;
  commentCount: number;
  liked: boolean;
  bookmarked: boolean;
  onOpen: () => void;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onCommentIntent?: (openComposer: () => void) => void;
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
        <div className="flex items-start gap-3">
          <UserAvatar name={post.authorNickname} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`${typeCaption} font-semibold text-white/85`}>{post.authorNickname}</p>
              <CategoryBadge category={post.category} compact />
            </div>
            <p className={`mt-0.5 tabular-nums ${typeCaption} text-white/50`}>
              {formatCommunityDate(post.createdAt)}
            </p>
          </div>
        </div>

        {post.imageDataUrl ? (
          <img
            src={post.imageDataUrl}
            alt=""
            className="mt-3 h-36 w-full rounded-[16px] object-cover ring-1 ring-white/20"
            loading="lazy"
          />
        ) : null}

        <h2 className={`mt-3 line-clamp-2 ${typeCardTitle}`}>{post.title}</h2>
        <p className={`mt-2 line-clamp-3 ${typeCardDesc}`}>{post.body}</p>

        {post.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/12 px-2 py-0.5 text-[11px] font-medium text-white/75"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </button>

      <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
        <div className="flex items-center gap-1">
          <LikeButton count={post.likeUserIds.length} active={liked} onToggle={onToggleLike} />
          <CommentActionButton
            count={commentCount}
            active={composerOpen}
            onClick={() => {
              if (composerOpen) {
                setComposerOpen(false);
                return;
              }
              const open = () => setComposerOpen(true);
              if (onCommentIntent) onCommentIntent(open);
              else open();
            }}
          />
        </div>
        <BookmarkButton active={bookmarked} onToggle={onToggleBookmark} />
      </div>

      {composerOpen ? (
        <CommentComposerBar
          value={commentText}
          onChange={setCommentText}
          onSubmit={submitComment}
          autoFocus
        />
      ) : null}
    </article>
  );
});
