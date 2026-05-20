import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { CommentSection } from '../components/community/PostDetail/CommentSection';
import { PostContent } from '../components/community/PostDetail/PostContent';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { useCommunityStore } from '../store/useCommunityStore';
import { typeBodySm, typeScreenTitle } from '../lib/typography';

const CommunityPostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { displayName, userId } = useCommunityAuthor();

  const post = useCommunityStore((s) => (postId ? s.getPost(postId) : undefined));
  const rawComments = useCommunityStore((s) => s.comments);
  const addComment = useCommunityStore((s) => s.addComment);
  const updateComment = useCommunityStore((s) => s.updateComment);
  const deleteComment = useCommunityStore((s) => s.deleteComment);
  const toggleCommentLike = useCommunityStore((s) => s.toggleCommentLike);
  const togglePostLike = useCommunityStore((s) => s.togglePostLike);
  const togglePostBookmark = useCommunityStore((s) => s.togglePostBookmark);
  const reportPost = useCommunityStore((s) => s.reportPost);
  const blockUser = useCommunityStore((s) => s.blockUser);
  const deletePost = useCommunityStore((s) => s.deletePost);

  const comments = useMemo(() => {
    if (!postId) return [];
    return rawComments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rawComments, postId]);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!post || !postId) {
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

  const isAuthor = post.authorNickname === displayName;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (deletePost(postId, displayName)) navigate('/community');
  };

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
          <PostContent
            post={post}
            liked={post.likeUserIds.includes(userId)}
            bookmarked={post.bookmarkUserIds.includes(userId)}
            isAuthor={isAuthor}
            onToggleLike={() => togglePostLike(postId, userId)}
            onToggleBookmark={() => togglePostBookmark(postId, userId)}
            onEdit={isAuthor ? () => navigate(`/community/${postId}/edit`) : undefined}
            onDelete={isAuthor ? handleDelete : undefined}
            onReport={
              !isAuthor
                ? () => {
                    reportPost(postId);
                    navigate('/community');
                  }
                : undefined
            }
            onBlockAuthor={
              !isAuthor
                ? () => {
                    blockUser(post.authorNickname);
                    navigate('/community');
                  }
                : undefined
            }
          />
          {confirmDelete && isAuthor ? (
            <p className="text-center text-[12px] text-rose-200">한 번 더 누르면 삭제됩니다.</p>
          ) : null}

          <CommentSection
            postId={postId}
            comments={comments}
            userId={userId}
            displayName={displayName}
            onAddComment={(body, parentId) =>
              addComment({ postId, authorNickname: displayName, body, parentId })
            }
            onUpdateComment={(id, body) => updateComment(id, displayName, body)}
            onDeleteComment={(id) => deleteComment(id, displayName)}
            onToggleCommentLike={(id) => toggleCommentLike(id, userId)}
          />
        </div>
      </main>
    </div>
  );
};

export default CommunityPostDetail;
