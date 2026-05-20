import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { CommunityCoachMark } from '../components/community/CommunityCoachMark';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { CommunityToast, type CommunityToastTone } from '../components/community/CommunityToast';
import { ReportBottomSheet } from '../components/community/ReportBottomSheet';
import { CommentSection } from '../components/community/PostDetail/CommentSection';
import { PostContent } from '../components/community/PostDetail/PostContent';
import { PremiumScrollArea } from '../components/ui/PremiumScrollArea';
import { useCommunityFeatureHint } from '../hooks/useCommunityFeatureHint';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { useCommunityStore } from '../store/useCommunityStore';
import type { CommunityReportReason } from '../types/community';
import { typeBodySm } from '../lib/typography';

const CommunityPostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { displayName, userId } = useCommunityAuthor();
  const goBack = useGoBack('/community');
  const { activeHint, anchorRect, runWithHint, closeHint, completeHint } =
    useCommunityFeatureHint();

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<CommunityToastTone>('default');
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    return useCommunityStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const post = useMemo(
    () => (postId ? posts.find((p) => p.id === postId) : undefined),
    [posts, postId],
  );

  const comments = useMemo(() => {
    if (!postId) return [];
    return rawComments.filter((c) => c.postId === postId);
  }, [rawComments, postId]);

  const showBookmarkToast = useCallback(() => {
    if (!postId) return;
    const saved = togglePostBookmark(postId, userId);
    setToastTone(saved ? 'saved' : 'default');
    setToast(saved ? '저장한 글에 추가됐어요' : '저장을 해제했어요');
  }, [postId, togglePostBookmark, userId]);

  const handleReportSubmit = useCallback(
    (reason: CommunityReportReason) => {
      if (!postId) return;
      reportPost(postId, reason);
      setReportOpen(false);
      setToastTone('success');
      setToast('신고가 접수됐어요');
      window.setTimeout(() => navigate('/community'), 1200);
    },
    [postId, reportPost, navigate],
  );

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
            onClick={goBack}
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

  const openReportSheet = (anchor: HTMLElement) => {
    runWithHint('report', () => setReportOpen(true), anchor);
  };

  return (
    <CommunityLayout
      title="게시글"
      subtitle={post.title}
      showFab={false}
      headerScrolled={headerScrolled}
      headerExtra={
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
          aria-label="목록으로"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      }
    >
      <CommunityToast message={toast} tone={toastTone} />
      <CommunityCoachMark
        hintKey={activeHint}
        anchorRect={anchorRect}
        onClose={closeHint}
        onComplete={completeHint}
      />
      <ReportBottomSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
      />

      <PremiumScrollArea
        showTopChrome
        className="mt-2 space-y-4 pb-2"
        onScrollState={(s) => setHeaderScrolled(s.isScrolled)}
      >
        <PostContent
          post={post}
          liked={post.likeUserIds.includes(userId)}
          bookmarked={post.bookmarkUserIds.includes(userId)}
          isAuthor={isPostAuthor}
          onToggleLike={() => runWithHint('like', () => togglePostLike(postId, userId))}
          onToggleBookmark={(anchor) => runWithHint('bookmark', showBookmarkToast, anchor)}
          onEdit={isPostAuthor ? () => navigate(`/community/${postId}/edit`) : undefined}
          onDelete={isPostAuthor ? handleDelete : undefined}
          onReportClick={!isPostAuthor ? openReportSheet : undefined}
          onBlockAuthor={
            !isPostAuthor
              ? () => {
                  blockUser(post.authorNickname);
                  setToastTone('success');
                  setToast('작성자를 차단했어요');
                  window.setTimeout(() => navigate('/community'), 1000);
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
          onCommentFocus={(anchor) => runWithHint('comment', () => {}, anchor)}
          onAddComment={(body, parentId) =>
            addComment({ postId, authorNickname: displayName, body, parentId })
          }
          onUpdateComment={(id, body) => updateComment(id, displayName, body)}
          onDeleteComment={(id) => deleteComment(id, displayName)}
          onToggleCommentLike={(id) => toggleCommentLike(id, userId)}
          onPinComment={isPostAuthor ? handlePin : undefined}
        />
      </PremiumScrollArea>
    </CommunityLayout>
  );
};

export default CommunityPostDetail;
