import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { CategoryTabs } from '../components/community/CategoryTabs';
import { PostFilters } from '../components/community/PostFilters';
import { PostList } from '../components/community/PostList';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { countCommentsForPost, filterAndSortPosts } from '../lib/community/postQuery';
import { useCommunityStore } from '../store/useCommunityStore';
import type { CommunityCategoryFilter, CommunitySortKey } from '../types/community';

const Community = () => {
  const navigate = useNavigate();
  const { userId, displayName } = useCommunityAuthor();

  const rawPosts = useCommunityStore((s) => s.posts);
  const rawComments = useCommunityStore((s) => s.comments);
  const reportedPostIds = useCommunityStore((s) => s.reportedPostIds);
  const blockedUserIds = useCommunityStore((s) => s.blockedUserIds);
  const addComment = useCommunityStore((s) => s.addComment);
  const togglePostLike = useCommunityStore((s) => s.togglePostLike);
  const togglePostBookmark = useCommunityStore((s) => s.togglePostBookmark);

  const [category, setCategory] = useState<CommunityCategoryFilter>('all');
  const [sort, setSort] = useState<CommunitySortKey>('latest');
  const [search, setSearch] = useState('');

  const hiddenPostIds = useMemo(() => {
    const hidden = new Set<string>(reportedPostIds);
    for (const p of rawPosts) {
      if (blockedUserIds.includes(p.authorNickname)) hidden.add(p.id);
    }
    return hidden;
  }, [rawPosts, reportedPostIds, blockedUserIds]);

  const posts = useMemo(
    () =>
      filterAndSortPosts(rawPosts, rawComments, { category, sort, search, tags: [] }, hiddenPostIds),
    [rawPosts, rawComments, category, sort, search, hiddenPostIds],
  );

  const commentCountByPost = useCallback(
    (postId: string) => countCommentsForPost(rawComments, postId),
    [rawComments],
  );

  return (
    <CommunityLayout onWriteClick={() => navigate('/community/write')}>
      <div className="mt-4 shrink-0">
        <CategoryTabs value={category} onChange={setCategory} />
      </div>
      <PostFilters search={search} sort={sort} onSearchChange={setSearch} onSortChange={setSort} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PostList
          posts={posts}
          commentCountByPost={commentCountByPost}
          userId={userId}
          onOpenPost={(id) => navigate(`/community/${id}`)}
          onToggleLike={(id) => togglePostLike(id, userId)}
          onToggleBookmark={(id) => togglePostBookmark(id, userId)}
          onAddComment={(postId, body) =>
            addComment({ postId, authorNickname: displayName, body })
          }
        />
      </div>
    </CommunityLayout>
  );
};

export default Community;
