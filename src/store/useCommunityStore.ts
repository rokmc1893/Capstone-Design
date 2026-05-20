import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommunityComment, CommunityPost } from '../types/community';

type CommunityState = {
  posts: CommunityPost[];
  comments: CommunityComment[];
  addPost: (payload: { authorNickname: string; title: string; body: string }) => string;
  addComment: (payload: { postId: string; authorNickname: string; body: string }) => void;
  getPost: (id: string) => CommunityPost | undefined;
  commentsForPost: (postId: string) => CommunityComment[];
};

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SEED_POSTS: CommunityPost[] = [
  {
    id: 'seed-1',
    authorNickname: '담나',
    title: '수면 시간 늘리는 데 도움 됐던 방법',
    body: '최근 검사 후 미션으로 취침 시간을 조금씩 앞당겼는데, 아침에 덜 피곤해요. 비슷한 경험 있으신 분 계신가요?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'seed-2',
    authorNickname: '유소민',
    title: '검사 리포트 보는 팁',
    body: '상세 리포트에서 「동일 연령·성별 대비」 표가 이해하기 쉬웠어요. 평균과 비교해서 어떤 항목을 먼저 손볼지 정했습니다.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: SEED_POSTS,
      comments: [
        {
          id: 'seed-c1',
          postId: 'seed-1',
          authorNickname: '유소민',
          body: '저도 미션 알림 켜 두고 일찍 자려고 하니까 조금 나아졌어요!',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        },
      ],
      addPost: ({ authorNickname, title, body }) => {
        const id = newId();
        const post: CommunityPost = {
          id,
          authorNickname,
          title: title.trim(),
          body: body.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ posts: [post, ...s.posts] }));
        return id;
      },
      addComment: ({ postId, authorNickname, body }) => {
        const comment: CommunityComment = {
          id: newId(),
          postId,
          authorNickname,
          body: body.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ comments: [...s.comments, comment] }));
      },
      getPost: (id) => get().posts.find((p) => p.id === id),
      commentsForPost: (postId) =>
        get()
          .comments.filter((c) => c.postId === postId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    }),
    { name: 'community-posts-v1' },
  ),
);
