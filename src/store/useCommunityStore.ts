import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isCommunityCategory } from '../lib/community/categories';
import {
  COMMENT_BODY_MAX,
  POST_BODY_MAX,
  POST_TITLE_MAX,
  sanitizePlainText,
} from '../lib/community/sanitize';
import type {
  CommunityCategory,
  CommunityComment,
  CommunityPost,
  CreatePostPayload,
  UpdatePostPayload,
} from '../types/community';

type PersistSlice = {
  posts: CommunityPost[];
  comments: CommunityComment[];
  reportedPostIds: string[];
  blockedUserIds: string[];
};

type CommunityState = PersistSlice & {
  addPost: (payload: CreatePostPayload) => string;
  updatePost: (postId: string, editorId: string, payload: UpdatePostPayload) => boolean;
  deletePost: (postId: string, editorId: string) => boolean;
  togglePostLike: (postId: string, userId: string) => void;
  togglePostBookmark: (postId: string, userId: string) => void;
  reportPost: (postId: string) => void;
  blockUser: (userId: string) => void;
  addComment: (payload: {
    postId: string;
    authorNickname: string;
    body: string;
    parentId?: string;
  }) => string | null;
  updateComment: (commentId: string, editorId: string, body: string) => boolean;
  deleteComment: (commentId: string, editorId: string) => boolean;
  toggleCommentLike: (commentId: string, userId: string) => void;
  getPost: (id: string) => CommunityPost | undefined;
  isPostBookmarked: (postId: string, userId: string) => boolean;
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeCategory(value: unknown): CommunityCategory {
  return isCommunityCategory(value) ? value : 'motivation';
}

function normalizePost(raw: Partial<CommunityPost> & { id: string }): CommunityPost {
  return {
    id: raw.id,
    authorNickname: sanitizePlainText(String(raw.authorNickname ?? '회원'), 40),
    category: normalizeCategory(raw.category),
    title: sanitizePlainText(String(raw.title ?? ''), POST_TITLE_MAX),
    body: sanitizePlainText(String(raw.body ?? ''), POST_BODY_MAX),
    tags: Array.isArray(raw.tags)
      ? raw.tags.map((t) => sanitizePlainText(String(t), 20)).filter(Boolean).slice(0, 8)
      : [],
    imageDataUrl: typeof raw.imageDataUrl === 'string' ? raw.imageDataUrl : undefined,
    likeUserIds: Array.isArray(raw.likeUserIds) ? raw.likeUserIds.map(String) : [],
    bookmarkUserIds: Array.isArray(raw.bookmarkUserIds) ? raw.bookmarkUserIds.map(String) : [],
    createdAt:
      typeof raw.createdAt === 'string' && !Number.isNaN(Date.parse(raw.createdAt))
        ? raw.createdAt
        : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
  };
}

function normalizeComment(raw: Partial<CommunityComment> & { id: string; postId: string }): CommunityComment {
  return {
    id: raw.id,
    postId: raw.postId,
    parentId: typeof raw.parentId === 'string' ? raw.parentId : undefined,
    authorNickname: sanitizePlainText(String(raw.authorNickname ?? '회원'), 40),
    body: sanitizePlainText(String(raw.body ?? ''), COMMENT_BODY_MAX),
    likeUserIds: Array.isArray(raw.likeUserIds) ? raw.likeUserIds.map(String) : [],
    createdAt:
      typeof raw.createdAt === 'string' && !Number.isNaN(Date.parse(raw.createdAt))
        ? raw.createdAt
        : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
  };
}

const SEED_POSTS: CommunityPost[] = [
  normalizePost({
    id: 'seed-1',
    authorNickname: '건강러버',
    category: 'progress',
    title: '수면 시간 늘리는 데 도움 됐던 방법',
    body: '최근 검사 후 미션으로 취침 시간을 조금씩 앞당겼는데, 아침에 덜 피곤해요.\n\n비슷한 경험 있으신 분 계신가요?',
    tags: ['수면', '미션'],
    likeUserIds: ['seed-like-1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  }),
  normalizePost({
    id: 'seed-2',
    authorNickname: '리포트탐험',
    category: 'qa',
    title: '검사 리포트 보는 팁',
    body: '상세 리포트에서 **동일 연령·성별 대비** 표가 이해하기 쉬웠어요.\n평균과 비교해서 어떤 항목을 먼저 손볼지 정했습니다.',
    tags: ['리포트', '초보'],
    likeUserIds: ['seed-like-2', 'seed-like-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  }),
  normalizePost({
    id: 'seed-3',
    authorNickname: '헬스초보',
    category: 'routine',
    title: '주 3회 상체 루틴 공유',
    body: '- 월: 가슴·삼두\n- 수: 등·이두\n- 금: 어깨·코어\n\n초보에게 적당한지 봐 주세요!',
    tags: ['헬스', '루틴', '초보'],
    likeUserIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  }),
];

const SEED_COMMENTS: CommunityComment[] = [
  normalizeComment({
    id: 'seed-c1',
    postId: 'seed-1',
    authorNickname: '미션메이트',
    body: '저도 미션 알림 켜 두고 일찍 자려고 하니까 조금 나아졌어요!',
    likeUserIds: ['seed-like-2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  }),
];

/** 저장된 시드 글은 최신 데모 내용으로 갱신 (예전 하드코딩 닉네임 제거) */
function applySeedOverrides(posts: CommunityPost[]): CommunityPost[] {
  const byId = new Map(SEED_POSTS.map((p) => [p.id, p]));
  return posts.map((p) => (byId.has(p.id) ? byId.get(p.id)! : p));
}

function applySeedCommentOverrides(comments: CommunityComment[]): CommunityComment[] {
  const seeds = new Map(SEED_COMMENTS.map((c) => [c.id, c]));
  const hasSeed = comments.some((c) => seeds.has(c.id));
  if (!hasSeed && comments.length === 0) return SEED_COMMENTS;
  return comments.map((c) => (seeds.has(c.id) ? seeds.get(c.id)! : c));
}

function asPostList(value: unknown): CommunityPost[] {
  if (!Array.isArray(value) || value.length === 0) return SEED_POSTS;
  const list = value.map((p) =>
    normalizePost({ ...(p as CommunityPost), id: String((p as CommunityPost).id) }),
  );
  return applySeedOverrides(list);
}

function asCommentList(value: unknown): CommunityComment[] {
  if (!Array.isArray(value)) return SEED_COMMENTS;
  const list = value.map((c) =>
    normalizeComment({
      ...(c as CommunityComment),
      id: String((c as CommunityComment).id),
      postId: String((c as CommunityComment).postId),
    }),
  );
  return applySeedCommentOverrides(list);
}

function toggleId(list: string[], userId: string): string[] {
  return list.includes(userId) ? list.filter((id) => id !== userId) : [...list, userId];
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: SEED_POSTS,
      comments: asCommentList(undefined),
      reportedPostIds: [],
      blockedUserIds: [],

      addPost: (payload) => {
        const id = newId();
        const post = normalizePost({
          id,
          authorNickname: payload.authorNickname,
          category: payload.category,
          title: sanitizePlainText(payload.title, POST_TITLE_MAX),
          body: sanitizePlainText(payload.body, POST_BODY_MAX),
          tags: payload.tags,
          imageDataUrl: payload.imageDataUrl,
          likeUserIds: [],
          bookmarkUserIds: [],
          createdAt: new Date().toISOString(),
        });
        set((s) => ({ posts: [post, ...asPostList(s.posts)] }));
        return id;
      },

      updatePost: (postId, editorId, payload) => {
        const posts = asPostList(get().posts);
        const idx = posts.findIndex((p) => p.id === postId);
        if (idx < 0 || posts[idx].authorNickname !== editorId) return false;
        const prev = posts[idx];
        const next = normalizePost({
          ...prev,
          category: payload.category ?? prev.category,
          title: payload.title != null ? sanitizePlainText(payload.title, POST_TITLE_MAX) : prev.title,
          body: payload.body != null ? sanitizePlainText(payload.body, POST_BODY_MAX) : prev.body,
          tags: payload.tags ?? prev.tags,
          imageDataUrl: payload.imageDataUrl !== undefined ? payload.imageDataUrl : prev.imageDataUrl,
          updatedAt: new Date().toISOString(),
        });
        const copy = [...posts];
        copy[idx] = next;
        set({ posts: copy });
        return true;
      },

      deletePost: (postId, editorId) => {
        const posts = asPostList(get().posts);
        const target = posts.find((p) => p.id === postId);
        if (!target || target.authorNickname !== editorId) return false;
        set({
          posts: posts.filter((p) => p.id !== postId),
          comments: asCommentList(get().comments).filter((c) => c.postId !== postId),
        });
        return true;
      },

      togglePostLike: (postId, userId) => {
        set((s) => ({
          posts: asPostList(s.posts).map((p) =>
            p.id === postId ? { ...p, likeUserIds: toggleId(p.likeUserIds, userId) } : p,
          ),
        }));
      },

      togglePostBookmark: (postId, userId) => {
        set((s) => ({
          posts: asPostList(s.posts).map((p) =>
            p.id === postId ? { ...p, bookmarkUserIds: toggleId(p.bookmarkUserIds, userId) } : p,
          ),
        }));
      },

      reportPost: (postId) => {
        set((s) => ({
          reportedPostIds: s.reportedPostIds.includes(postId)
            ? s.reportedPostIds
            : [...s.reportedPostIds, postId],
        }));
      },

      blockUser: (userId) => {
        set((s) => ({
          blockedUserIds: s.blockedUserIds.includes(userId)
            ? s.blockedUserIds
            : [...s.blockedUserIds, userId],
        }));
      },

      addComment: ({ postId, authorNickname, body, parentId }) => {
        if (!asPostList(get().posts).some((p) => p.id === postId)) return null;
        const id = newId();
        const comment = normalizeComment({
          id,
          postId,
          parentId,
          authorNickname,
          body: sanitizePlainText(body, COMMENT_BODY_MAX),
          likeUserIds: [],
          createdAt: new Date().toISOString(),
        });
        set((s) => ({ comments: [...asCommentList(s.comments), comment] }));
        return id;
      },

      updateComment: (commentId, editorId, body) => {
        const comments = asCommentList(get().comments);
        const idx = comments.findIndex((c) => c.id === commentId);
        if (idx < 0 || comments[idx].authorNickname !== editorId) return false;
        const copy = [...comments];
        copy[idx] = {
          ...copy[idx],
          body: sanitizePlainText(body, COMMENT_BODY_MAX),
          updatedAt: new Date().toISOString(),
        };
        set({ comments: copy });
        return true;
      },

      deleteComment: (commentId, editorId) => {
        const comments = asCommentList(get().comments);
        const target = comments.find((c) => c.id === commentId);
        if (!target || target.authorNickname !== editorId) return false;
        const childIds = new Set(
          comments.filter((c) => c.parentId === commentId).map((c) => c.id),
        );
        childIds.add(commentId);
        set({ comments: comments.filter((c) => !childIds.has(c.id)) });
        return true;
      },

      toggleCommentLike: (commentId, userId) => {
        set((s) => ({
          comments: asCommentList(s.comments).map((c) =>
            c.id === commentId ? { ...c, likeUserIds: toggleId(c.likeUserIds, userId) } : c,
          ),
        }));
      },

      getPost: (id) => asPostList(get().posts).find((p) => p.id === id),

      isPostBookmarked: (postId, userId) => {
        const post = get().getPost(postId);
        return post?.bookmarkUserIds.includes(userId) ?? false;
      },
    }),
    {
      name: 'community-posts-v2',
      partialize: (state) => ({
        posts: state.posts,
        comments: state.comments,
        reportedPostIds: state.reportedPostIds,
        blockedUserIds: state.blockedUserIds,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistSlice> | undefined;
        return {
          ...current,
          posts: applySeedOverrides(asPostList(saved?.posts ?? current.posts)),
          comments: applySeedCommentOverrides(asCommentList(saved?.comments ?? current.comments)),
          reportedPostIds: Array.isArray(saved?.reportedPostIds) ? saved.reportedPostIds : [],
          blockedUserIds: Array.isArray(saved?.blockedUserIds) ? saved.blockedUserIds : [],
        };
      },
    },
  ),
);
