import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { ChevronLeft } from 'lucide-react';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { PostEditor } from '../components/community/PostEditor/PostEditor';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { PremiumScrollArea } from '../components/ui/PremiumScrollArea';
import { useCommunityStore } from '../store/useCommunityStore';
import { typeBodySm } from '../lib/typography';

const CommunityPostEdit = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const goBack = useGoBack(postId ? `/community/${postId}` : '/community');
  const { displayName } = useCommunityAuthor();
  const post = useCommunityStore((s) => (postId ? s.getPost(postId) : undefined));
  const updatePost = useCommunityStore((s) => s.updatePost);

  useEffect(() => {
    if (post && postId && post.authorNickname !== displayName) {
      navigate(`/community/${postId}`, { replace: true });
    }
  }, [post, displayName, navigate, postId]);

  if (!post || !postId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-[104px]">
        <p className={typeBodySm}>게시글을 찾을 수 없어요.</p>
      </div>
    );
  }

  if (post.authorNickname !== displayName) {
    return null;
  }

  return (
    <CommunityLayout
      title="글 수정"
      subtitle="내용을 수정한 뒤 저장해 주세요."
      showFab={false}
      headerExtra={
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="뒤로"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      }
    >
      <PremiumScrollArea showTopChrome className="mt-2 pb-4">
        <PostEditor
          initial={post}
          onCancel={goBack}
          onSubmit={(payload) => {
            updatePost(postId, displayName, payload);
            navigate(`/community/${postId}`);
          }}
        />
      </PremiumScrollArea>
    </CommunityLayout>
  );
};

export default CommunityPostEdit;
