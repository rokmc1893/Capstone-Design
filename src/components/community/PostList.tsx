import { memo } from 'react';
import { Bookmark, Flame, MessageCircle } from 'lucide-react';
import type { CommunityFeedTab, CommunityPost } from '../../types/community';
import {
  typeCommunityPostBody,
  typeCommunityPostTitle,
} from '../../lib/typography';
import { glassCommunityPostCard } from '../ui/glassStyles';
import { SkeletonShimmer } from '../ui/SkeletonShimmer';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: CommunityPost[];
  feedTab?: CommunityFeedTab;
  commentCountByPost: (postId: string) => number;
  userId: string;
  onOpenPost: (postId: string) => void;
  onToggleLike: (postId: string, anchor: HTMLElement) => void;
  onToggleBookmark: (postId: string, anchor: HTMLElement) => void;
  onCommentIntent?: (postId: string, openComposer: () => void, anchor: HTMLElement) => void;
  onAddComment: (postId: string, body: string) => void;
  loading?: boolean;
};

function EmptyState({ feedTab }: { feedTab: CommunityFeedTab }) {
  if (feedTab === 'saved') {
    return (
      <div
        className={`${glassCommunityPostCard} mt-2 flex flex-col items-center justify-center px-6 py-16 text-center`}
      >
        <Bookmark className="h-11 w-11 text-white/70" strokeWidth={1.5} aria-hidden />
        <p className={`mt-6 ${typeCommunityPostTitle}`}>저장한 글이 없어요</p>
        <p className={`mt-3 ${typeCommunityPostBody}`}>
          마음에 드는 글을 저장하면
          <br />
          여기에서 다시 볼 수 있어요
        </p>
      </div>
    );
  }
  if (feedTab === 'popular') {
    return (
      <div
        className={`${glassCommunityPostCard} mt-2 flex flex-col items-center justify-center px-6 py-16 text-center`}
      >
        <Flame className="h-11 w-11 text-white/70" strokeWidth={1.5} aria-hidden />
        <p className={`mt-6 ${typeCommunityPostTitle}`}>인기 글이 없어요</p>
        <p className={`mt-3 ${typeCommunityPostBody}`}>첫 공감이 모이면 이곳에 표시돼요</p>
      </div>
    );
  }
  return (
    <div
      className={`${glassCommunityPostCard} mt-2 flex flex-col items-center justify-center px-6 py-16 text-center`}
    >
      <MessageCircle className="h-12 w-12 text-white/85" strokeWidth={1.5} aria-hidden />
      <p className={`mt-6 ${typeCommunityPostTitle}`}>조건에 맞는 게시글이 없어요</p>
      <p className={`mt-3 ${typeCommunityPostBody}`}>
        다른 카테고리를 선택하거나 글을 작성해 보세요.
      </p>
    </div>
  );
}

export const PostList = memo(function PostList({
  posts,
  feedTab = 'all',
  commentCountByPost,
  userId,
  onOpenPost,
  onToggleLike,
  onToggleBookmark,
  onCommentIntent,
  onAddComment,
  loading,
}: PostListProps) {
  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <SkeletonShimmer key={i} className="h-44" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <EmptyState feedTab={feedTab} />;
  }

  return (
    <ul className="mt-4 space-y-5 pb-3" aria-label="게시글 목록">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            commentCount={commentCountByPost(post.id)}
            liked={post.likeUserIds.includes(userId)}
            bookmarked={post.bookmarkUserIds.includes(userId)}
            onOpen={() => onOpenPost(post.id)}
            onToggleLike={(anchor) => onToggleLike(post.id, anchor)}
            onToggleBookmark={(anchor) => onToggleBookmark(post.id, anchor)}
            onCommentIntent={
              onCommentIntent
                ? (open, anchor) => onCommentIntent(post.id, open, anchor)
                : undefined
            }
            onAddComment={(body) => onAddComment(post.id, body)}
          />
        </li>
      ))}
    </ul>
  );
});
