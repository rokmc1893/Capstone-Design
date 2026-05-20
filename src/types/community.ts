/** 커뮤니티 게시글 카테고리 (저장값) */
export type CommunityCategory =
  | 'routine'
  | 'nutrition'
  | 'qa'
  | 'progress'
  | 'motivation';

export type CommunityCategoryFilter = 'all' | CommunityCategory;

export type CommunitySortKey = 'latest' | 'popular' | 'comments';

export type CommunityPost = {
  id: string;
  authorNickname: string;
  category: CommunityCategory;
  title: string;
  body: string;
  tags: string[];
  /** data URL — 로컬 MVP (백엔드 연동 전) */
  imageDataUrl?: string;
  likeUserIds: string[];
  bookmarkUserIds: string[];
  createdAt: string;
  updatedAt?: string;
};

export type CommunityComment = {
  id: string;
  postId: string;
  parentId?: string;
  authorNickname: string;
  body: string;
  likeUserIds: string[];
  createdAt: string;
  updatedAt?: string;
};

export type CreatePostPayload = {
  authorNickname: string;
  category: CommunityCategory;
  title: string;
  body: string;
  tags: string[];
  imageDataUrl?: string;
};

export type UpdatePostPayload = Partial<
  Pick<CreatePostPayload, 'category' | 'title' | 'body' | 'tags' | 'imageDataUrl'>
>;
