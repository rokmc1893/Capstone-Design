import { memo } from 'react';
import { Bookmark, Flame, MessageCircle } from 'lucide-react';
import type { CommunityFeedTab, CommunityPost } from '../../types/community';
import { typeCardDesc, typeCardTitle } from '../../lib/typography';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: CommunityPost[];
  feedTab?: CommunityFeedTab;
  commentCountByPost: (postId: string) => number;
  userId: string;
  onOpenPost: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  onCommentIntent?: (postId: string, openComposer: () => void) => void;
  onAddComment: (postId: string, body: string) => void;
  loading?: boolean;
};

function EmptyState({ feedTab }: { feedTab: CommunityFeedTab }) {
  if (feedTab === 'saved') {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center backdrop-blur-xl">
        <Bookmark className="h-11 w-11 text-white/70" strokeWidth={1.5} aria-hidden />
        <p className={`mt-5 ${typeCardTitle}`}>저장한 글이 없어요</p>
        <p className={`mt-2 ${typeCardDesc}`}>
          마음에 드는 글을 저장하면
          <br />
          여기에서 다시 볼 수 있어요
        </p>
      </div>
    );
  }
  if (feedTab === 'popular') {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center backdrop-blur-xl">
        <Flame className="h-11 w-11 text-white/70" strokeWidth={1.5} aria-hidden />
        <p className={`mt-5 ${typeCardTitle}`}>인기 글이 없어요</p>
        <p className={`mt-2 ${typeCardDesc}`}>첫 공감이 모이면 이곳에 표시돼요</p>
      </div>
    );
  }
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center backdrop-blur-xl">
      <MessageCircle className="h-12 w-12 text-white/85" strokeWidth={1.5} aria-hidden />
      <p className={`mt-5 ${typeCardTitle}`}>조건에 맞는 게시글이 없어요</p>
      <p className={`mt-2 ${typeCardDesc}`}>다른 카테고리를 선택하거나 글을 작성해 보세요.</p>
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
          <div
            key={i}
            className="h-40 animate-pulse rounded-[24px] border border-white/15 bg-white/[0.08]"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <EmptyState feedTab={feedTab} />;
  }

  return (
    <ul className="mt-4 space-y-3" aria-label="게시글 목록">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            commentCount={commentCountByPost(post.id)}
            liked={post.likeUserIds.includes(userId)}
            bookmarked={post.bookmarkUserIds.includes(userId)}
            onOpen={() => onOpenPost(post.id)}
            onToggleLike={() => onToggleLike(post.id)}
            onToggleBookmark={() => onToggleBookmark(post.id)}
            onCommentIntent={
              onCommentIntent
                ? (open) => onCommentIntent(post.id, open)
                : undefined
            }
            onAddComment={(body) => onAddComment(post.id, body)}
          />
        </li>
      ))}
    </ul>
  );
});
