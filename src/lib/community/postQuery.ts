import type {
  CommunityCategoryFilter,
  CommunityComment,
  CommunityFeedTab,
  CommunityPost,
  CommunitySortKey,
} from '../../types/community';

export type PostListFilters = {
  feedTab: CommunityFeedTab;
  category: CommunityCategoryFilter;
  sort: CommunitySortKey;
  search: string;
  tags: string[];
  bookmarkUserId?: string;
};

export function countCommentsForPost(comments: CommunityComment[], postId: string): number {
  return comments.filter((c) => c.postId === postId).length;
}

export function filterAndSortPosts(
  posts: CommunityPost[],
  comments: CommunityComment[],
  filters: PostListFilters,
  hiddenPostIds: Set<string>,
): CommunityPost[] {
  const q = filters.search.trim().toLowerCase();
  const tagSet = new Set(filters.tags.map((t) => t.toLowerCase()));

  let list = posts.filter((p) => !hiddenPostIds.has(p.id));

  if (filters.feedTab === 'saved' && filters.bookmarkUserId) {
    list = list.filter((p) => p.bookmarkUserIds.includes(filters.bookmarkUserId!));
  }

  const effectiveSort: CommunitySortKey =
    filters.feedTab === 'popular' ? 'popular' : filters.sort;

  if (filters.category !== 'all') {
    list = list.filter((p) => p.category === filters.category);
  }

  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (tagSet.size > 0) {
    list = list.filter((p) => p.tags.some((t) => tagSet.has(t.toLowerCase())));
  }

  const commentCount = (postId: string) => countCommentsForPost(comments, postId);

  switch (effectiveSort) {
    case 'popular':
      return [...list].sort((a, b) => {
        const d = b.likeUserIds.length - a.likeUserIds.length;
        if (d !== 0) return d;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'comments':
      return [...list].sort((a, b) => {
        const d = commentCount(b.id) - commentCount(a.id);
        if (d !== 0) return d;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'latest':
    default:
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
