import { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import type { CommunityPost } from '../../types/community';
import { typeCardDesc, typeCardTitle } from '../../lib/typography';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: CommunityPost[];
  commentCountByPost: (postId: string) => number;
  userId: string;
  onOpenPost: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  loading?: boolean;
};

export const PostList = memo(function PostList({
  posts,
  commentCountByPost,
  userId,
  onOpenPost,
  onToggleLike,
  onToggleBookmark,
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
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center backdrop-blur-xl">
        <MessageCircle className="h-12 w-12 text-white/85" strokeWidth={1.5} aria-hidden />
        <p className={`mt-5 ${typeCardTitle}`}>조건에 맞는 게시글이 없어요</p>
        <p className={`mt-2 ${typeCardDesc}`}>다른 카테고리를 선택하거나 글을 작성해 보세요.</p>
      </div>
    );
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
          />
        </li>
      ))}
    </ul>
  );
});
