/** 커뮤니티 게시글 카테고리 (저장값) */
export type CommunityCategory =
  | 'routine'
  | 'nutrition'
  | 'qa'
  | 'progress'
  | 'motivation';

export type CommunityCategoryFilter = 'all' | CommunityCategory;

export type CommunitySortKey = 'latest' | 'popular' | 'comments';

/** 커뮤니티 목록 상단 피드 (전체 / 인기 / 저장) */
export type CommunityFeedTab = 'all' | 'popular' | 'saved';

export type CommunityReportReason =
  | 'inappropriate'
  | 'abuse'
  | 'misinformation'
  | 'spam'
  | 'other';

/** 신고한 글 기록 (localStorage) */
export type CommunityReportRecord = {
  postId: string;
  reason: CommunityReportReason;
  reportedAt: string;
};

/** 차단한 작성자 기록 (localStorage) */
export type CommunityBlockedUser = {
  authorNickname: string;
  blockedAt: string;
};

export type CommunityHintKey = 'bookmark' | 'comment' | 'report' | 'like';

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
  /** 글 작성자가 고정한 댓글 id (없으면 null) */
  pinnedCommentId?: string | null;
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
