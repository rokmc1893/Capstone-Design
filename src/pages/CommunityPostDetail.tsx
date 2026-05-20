import { useMemo, useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { glassCard } from '../components/ui/glassStyles';
import { formatCommunityDate } from '../lib/communityFormat';
import { getDisplayName } from '../lib/displayName';
import { useAuthStore } from '../store/useAuthStore';
import { useCommunityStore } from '../store/useCommunityStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import {
  typeBodySm,
  typeCaption,
  typeCardDesc,
  typeCardTitle,
  typeScreenTitle,
} from '../lib/typography';

const SURFACE = `${glassCard} px-4 py-4`;

const CommunityPostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const authNickname = useAuthStore((s) => s.user?.nickname);
  const profileName = useUserProfileStore((s) => s.name);
  const profileNickname = useUserProfileStore((s) => s.nickname);
  const authorName = getDisplayName(authNickname, profileNickname, profileName);

  const post = useCommunityStore((s) => (postId ? s.getPost(postId) : undefined));
  const comments = useCommunityStore((s) =>
    postId ? s.commentsForPost(postId) : [],
  );
  const addComment = useCommunityStore((s) => s.addComment);

  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const commentCountLabel = useMemo(
    () => `댓글 ${comments.length}개`,
    [comments.length],
  );

  const handleSubmitComment = () => {
    const body = commentText.trim();
    if (!postId || !body) {
      setError('댓글 내용을 입력해 주세요.');
      return;
    }
    addComment({ postId, authorNickname: authorName, body });
    setCommentText('');
    setError(null);
  };

  if (!post) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-[104px]">
          <p className={`${typeBodySm} text-white/85`}>게시글을 찾을 수 없어요.</p>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="mt-4 rounded-full bg-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            목록으로
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="relative z-10 shrink-0 pt-2">
        <StatusBar />
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[104px] pt-3">
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
            aria-label="목록으로"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className={typeScreenTitle}>게시글</h1>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <article className={SURFACE}>
            <p className={`${typeCaption} text-white/70`}>{post.authorNickname}</p>
            <h2 className={`mt-1.5 ${typeCardTitle}`}>{post.title}</h2>
            <p className={`mt-3 whitespace-pre-wrap ${typeCardDesc}`}>{post.body}</p>
            <p className={`mt-3 tabular-nums ${typeCaption} text-white/55`}>
              {formatCommunityDate(post.createdAt)}
            </p>
          </article>

          <section>
            <p className={`mb-3 ${typeCaption} font-semibold text-white/80`}>{commentCountLabel}</p>
            <ul className="space-y-3">
              {comments.length === 0 ? (
                <li className={`${SURFACE} text-center ${typeBodySm} text-white/75`}>
                  첫 댓글을 남겨 보세요.
                </li>
              ) : (
                comments.map((c) => (
                  <li key={c.id} className={SURFACE}>
                    <p className={`${typeCaption} font-semibold text-white/80`}>{c.authorNickname}</p>
                    <p className={`mt-1.5 whitespace-pre-wrap ${typeCardDesc}`}>{c.body}</p>
                    <p className={`mt-2 tabular-nums ${typeCaption} text-white/50`}>
                      {formatCommunityDate(c.createdAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <div className={`mt-3 shrink-0 ${SURFACE}`}>
          <label className={`${typeCaption} font-semibold text-white/80`} htmlFor="comment-input">
            댓글 작성
          </label>
          <textarea
            id="comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={2}
            placeholder="댓글을 입력해 주세요"
            className="mt-2 w-full resize-none rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
          />
          {error ? <p className="mt-2 text-[12px] text-rose-200">{error}</p> : null}
          <button
            type="button"
            onClick={handleSubmitComment}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-white/90 py-3 text-[14px] font-semibold text-[#7B6EE8] active:scale-[0.98]"
          >
            <Send className="h-4 w-4" aria-hidden />
            등록
          </button>
        </div>
      </main>
    </div>
  );
};

export default CommunityPostDetail;
