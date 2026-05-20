import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { CommentSection } from '../components/community/PostDetail/CommentSection';
import { PostContent } from '../components/community/PostDetail/PostContent';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { useCommunityStore } from '../store/useCommunityStore';
import { typeBodySm } from '../lib/typography';

const CommunityPostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { displayName, userId } = useCommunityAuthor();

  const posts = useCommunityStore((s) => s.posts);
  const rawComments = useCommunityStore((s) => s.comments);
  const addComment = useCommunityStore((s) => s.addComment);
  const updateComment = useCommunityStore((s) => s.updateComment);
  const deleteComment = useCommunityStore((s) => s.deleteComment);
  const toggleCommentLike = useCommunityStore((s) => s.toggleCommentLike);
  const pinComment = useCommunityStore((s) => s.pinComment);
  const togglePostLike = useCommunityStore((s) => s.togglePostLike);
  const togglePostBookmark = useCommunityStore((s) => s.togglePostBookmark);
  const reportPost = useCommunityStore((s) => s.reportPost);
  const blockUser = useCommunityStore((s) => s.blockUser);
  const deletePost = useCommunityStore((s) => s.deletePost);

  const [hydrated, setHydrated] = useState(() => useCommunityStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useCommunityStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const post = useMemo(
    () => (postId ? posts.find((p) => p.id === postId) : undefined),
    [posts, postId],
  );

  const comments = useMemo(() => {
    if (!postId) return [];
    return rawComments.filter((c) => c.postId === postId);
  }, [rawComments, postId]);

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!hydrated) {
    return (
      <CommunityLayout title="게시글" showFab={false} subtitle="">
        <div className={`mt-8 text-center ${typeBodySm} text-white/80`}>불러오는 중…</div>
      </CommunityLayout>
    );
  }

  if (!postId || !post) {
    return (
      <CommunityLayout
        title="게시글"
        showFab={false}
        subtitle=""
        headerExtra={
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="목록으로"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        }
      >
        <div className="mt-8 flex flex-col items-center text-center">
          <p className={`${typeBodySm} text-white/85`}>게시글을 찾을 수 없어요.</p>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="mt-4 rounded-full bg-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            목록으로
          </button>
        </div>
      </CommunityLayout>
    );
  }

  const isPostAuthor = post.authorNickname === displayName;

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (deletePost(postId, displayName)) navigate('/community');
  };

  const handlePin = (commentId: string) => {
    const currently = post.pinnedCommentId === commentId;
    pinComment(postId, displayName, currently ? null : commentId);
  };

  return (
    <CommunityLayout
      title="게시글"
      subtitle={post.title}
      showFab={false}
      headerExtra={
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
          aria-label="목록으로"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      }
    >
      <div className="mt-2 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PostContent
          post={post}
          liked={post.likeUserIds.includes(userId)}
          bookmarked={post.bookmarkUserIds.includes(userId)}
          isAuthor={isPostAuthor}
          onToggleLike={() => togglePostLike(postId, userId)}
          onToggleBookmark={() => togglePostBookmark(postId, userId)}
          onEdit={isPostAuthor ? () => navigate(`/community/${postId}/edit`) : undefined}
          onDelete={isPostAuthor ? handleDelete : undefined}
          onReport={
            !isPostAuthor
              ? () => {
                  reportPost(postId);
                  navigate('/community');
                }
              : undefined
          }
          onBlockAuthor={
            !isPostAuthor
              ? () => {
                  blockUser(post.authorNickname);
                  navigate('/community');
                }
              : undefined
          }
        />
        {confirmDelete && isPostAuthor ? (
          <p className="text-center text-[12px] text-rose-200">한 번 더 누르면 삭제됩니다.</p>
        ) : null}

        <CommentSection
          postId={postId}
          comments={comments}
          userId={userId}
          displayName={displayName}
          isPostAuthor={isPostAuthor}
          pinnedCommentId={post.pinnedCommentId ?? null}
          onAddComment={(body, parentId) =>
            addComment({ postId, authorNickname: displayName, body, parentId })
          }
          onUpdateComment={(id, body) => updateComment(id, displayName, body)}
          onDeleteComment={(id) => deleteComment(id, displayName)}
          onToggleCommentLike={(id) => toggleCommentLike(id, userId)}
          onPinComment={isPostAuthor ? handlePin : undefined}
        />
      </div>
    </CommunityLayout>
  );
};

export default CommunityPostDetail;
