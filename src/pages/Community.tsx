import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityCoachMark } from '../components/community/CommunityCoachMark';
import { CommunityFeedTabs } from '../components/community/CommunityFeedTabs';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { CommunityToast, type CommunityToastTone } from '../components/community/CommunityToast';
import { CategoryTabs } from '../components/community/CategoryTabs';
import { PostFilters } from '../components/community/PostFilters';
import { PostList } from '../components/community/PostList';
import { useCommunityFeatureHint } from '../hooks/useCommunityFeatureHint';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { countCommentsForPost, filterAndSortPosts } from '../lib/community/postQuery';
import { PremiumScrollArea } from '../components/ui/PremiumScrollArea';
import { useCommunityStore } from '../store/useCommunityStore';
import type {
  CommunityCategoryFilter,
  CommunityFeedTab,
  CommunitySortKey,
} from '../types/community';

const Community = () => {
  const navigate = useNavigate();
  const { userId, displayName } = useCommunityAuthor();
  const { activeHint, anchorRect, runWithHint, closeHint, completeHint } =
    useCommunityFeatureHint();

  const rawPosts = useCommunityStore((s) => s.posts);
  const rawComments = useCommunityStore((s) => s.comments);
  const reportedPostIds = useCommunityStore((s) => s.reportedPostIds);
  const blockedUserIds = useCommunityStore((s) => s.blockedUserIds);
  const addComment = useCommunityStore((s) => s.addComment);
  const togglePostLike = useCommunityStore((s) => s.togglePostLike);
  const togglePostBookmark = useCommunityStore((s) => s.togglePostBookmark);

  const [feedTab, setFeedTab] = useState<CommunityFeedTab>('all');
  const [category, setCategory] = useState<CommunityCategoryFilter>('all');
  const [sort, setSort] = useState<CommunitySortKey>('latest');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<CommunityToastTone>('default');
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const hiddenPostIds = useMemo(() => {
    const hidden = new Set<string>(reportedPostIds);
    for (const p of rawPosts) {
      if (blockedUserIds.includes(p.authorNickname)) hidden.add(p.id);
    }
    return hidden;
  }, [rawPosts, reportedPostIds, blockedUserIds]);

  const posts = useMemo(
    () =>
      filterAndSortPosts(
        rawPosts,
        rawComments,
        {
          feedTab,
          category: feedTab === 'all' ? category : 'all',
          sort,
          search: feedTab === 'all' ? search : '',
          tags: [],
          bookmarkUserId: userId,
        },
        hiddenPostIds,
      ),
    [rawPosts, rawComments, feedTab, category, sort, search, hiddenPostIds, userId],
  );

  const commentCountByPost = useCallback(
    (postId: string) => countCommentsForPost(rawComments, postId),
    [rawComments],
  );

  const showBookmarkToast = useCallback((postId: string) => {
    const saved = togglePostBookmark(postId, userId);
    setToastTone(saved ? 'saved' : 'default');
    setToast(saved ? '저장한 글에 추가됐어요' : '저장을 해제했어요');
  }, [togglePostBookmark, userId]);

  const handleToggleBookmark = useCallback(
    (postId: string, anchor: HTMLElement) => {
      runWithHint('bookmark', () => showBookmarkToast(postId), anchor);
    },
    [runWithHint, showBookmarkToast],
  );

  const handleToggleLike = useCallback(
    (postId: string) => {
      runWithHint('like', () => togglePostLike(postId, userId));
    },
    [runWithHint, togglePostLike, userId],
  );

  const handleCommentOpen = useCallback(
    (_postId: string, openComposer: () => void, anchor: HTMLElement) => {
      runWithHint('comment', openComposer, anchor);
    },
    [runWithHint],
  );

  const handleFeedTabChange = (tab: CommunityFeedTab) => {
    setFeedTab(tab);
    if (tab === 'popular') setSort('popular');
    if (tab === 'all') setSort('latest');
    if (tab === 'saved') setSort('latest');
  };

  return (
    <CommunityLayout
      headerScrolled={headerScrolled}
      onWriteClick={() => navigate('/community/write')}
    >
      <CommunityToast message={toast} tone={toastTone} />
      <CommunityCoachMark
        hintKey={activeHint}
        anchorRect={anchorRect}
        onClose={closeHint}
        onComplete={completeHint}
      />

      <PremiumScrollArea
        showTopChrome
        className="mt-3 min-h-0"
        onScrollState={(s) => setHeaderScrolled(s.isScrolled)}
      >
        <div className="mt-2 shrink-0">
          <CommunityFeedTabs value={feedTab} onChange={handleFeedTabChange} />
        </div>

        {feedTab === 'all' ? (
          <>
            <div className="mt-5 shrink-0">
              <CategoryTabs value={category} onChange={setCategory} />
            </div>
            <PostFilters
              search={search}
              sort={sort}
              onSearchChange={setSearch}
              onSortChange={setSort}
            />
          </>
        ) : (
          <p className="mt-5 shrink-0 text-[13px] leading-[1.65] text-white/52">
            {feedTab === 'popular'
              ? '공감을 많이 받은 글을 모았어요'
              : '저장한 글만 모아서 볼 수 있어요'}
          </p>
        )}

        <PostList
          posts={posts}
          feedTab={feedTab}
          commentCountByPost={commentCountByPost}
          userId={userId}
          onOpenPost={(id) => navigate(`/community/${id}`)}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
          onCommentIntent={handleCommentOpen}
          onAddComment={(postId, body) =>
            addComment({ postId, authorNickname: displayName, body })
          }
        />
      </PremiumScrollArea>
    </CommunityLayout>
  );
};

export default Community;
