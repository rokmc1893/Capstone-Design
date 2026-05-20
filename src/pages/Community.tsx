import { useState } from 'react';
import { MessageCircle, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { glassCard } from '../components/ui/glassStyles';
import { formatCommunityDate } from '../lib/communityFormat';
import { getDisplayName } from '../lib/displayName';
import { useAuthStore } from '../store/useAuthStore';
import { useCommunityStore } from '../store/useCommunityStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { typeCaption, typeCardDesc, typeCardTitle, typeScreenTitle } from '../lib/typography';

const SURFACE = `${glassCard} px-4 py-4`;

const Community = () => {
  const navigate = useNavigate();
  const authNickname = useAuthStore((s) => s.user?.nickname);
  const profileName = useUserProfileStore((s) => s.name);
  const profileNickname = useUserProfileStore((s) => s.nickname);
  const authorName = getDisplayName(authNickname, profileNickname, profileName);

  const posts = useCommunityStore((s) =>
    [...s.posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
  const comments = useCommunityStore((s) => s.comments);
  const addPost = useCommunityStore((s) => s.addPost);

  const [composeOpen, setComposeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const commentCountByPost = (postId: string) =>
    comments.filter((c) => c.postId === postId).length;

  const handlePublish = () => {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      setFormError('제목과 내용을 모두 입력해 주세요.');
      return;
    }
    const id = addPost({ authorNickname: authorName, title: t, body: b });
    setTitle('');
    setBody('');
    setComposeOpen(false);
    setFormError(null);
    navigate(`/community/${id}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="relative z-10 shrink-0 pt-2">
        <StatusBar />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[104px] pt-3">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h1 className={typeScreenTitle}>커뮤니티</h1>
            <p className={`mt-2 ${typeCaption}`}>이야기를 나누고 정보를 공유해 보세요.</p>
          </div>
          <button
            type="button"
            onClick={() => setComposeOpen((v) => !v)}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white/90 px-4 text-[13px] font-semibold text-[#7B6EE8] shadow-md active:scale-[0.97]"
            aria-expanded={composeOpen}
          >
            <PenLine className="h-4 w-4" aria-hidden />
            글쓰기
          </button>
        </div>

        {composeOpen ? (
          <section className={`mt-4 shrink-0 ${SURFACE}`}>
            <p className={`${typeCardTitle} text-[15px]`}>새 게시글</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="mt-3 w-full rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="내용을 입력해 주세요"
              className="mt-2 w-full resize-none rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
            />
            {formError ? <p className="mt-2 text-[12px] text-rose-200">{formError}</p> : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setComposeOpen(false);
                  setFormError(null);
                }}
                className="flex-1 rounded-[14px] bg-white/15 py-3 text-[14px] font-semibold text-white/90"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="flex-1 rounded-[14px] bg-white/90 py-3 text-[14px] font-semibold text-[#7B6EE8]"
              >
                등록
              </button>
            </div>
          </section>
        ) : null}

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-white/20 bg-white/[0.08] px-6 py-14 text-center backdrop-blur-xl">
              <MessageCircle className="h-12 w-12 text-white/85" strokeWidth={1.5} aria-hidden />
              <p className={`mt-5 ${typeCardTitle}`}>아직 게시글이 없어요</p>
              <p className={`mt-2 ${typeCardDesc}`}>글쓰기로 첫 이야기를 남겨 보세요.</p>
            </div>
          ) : (
            posts.map((post) => {
              const cc = commentCountByPost(post.id);
              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => navigate(`/community/${post.id}`)}
                  className={`w-full text-left transition active:scale-[0.99] ${SURFACE}`}
                >
                  <p className={`${typeCaption} text-white/70`}>{post.authorNickname}</p>
                  <p className={`mt-1 line-clamp-2 ${typeCardTitle}`}>{post.title}</p>
                  <p className={`mt-2 line-clamp-2 ${typeCardDesc}`}>{post.body}</p>
                  <div className={`mt-3 flex items-center justify-between ${typeCaption} text-white/55`}>
                    <span className="tabular-nums">{formatCommunityDate(post.createdAt)}</span>
                    <span>댓글 {cc}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
