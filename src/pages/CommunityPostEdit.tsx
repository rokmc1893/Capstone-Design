import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { PostEditor } from '../components/community/PostEditor/PostEditor';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { useCommunityStore } from '../store/useCommunityStore';
import { typeBodySm } from '../lib/typography';

const CommunityPostEdit = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { displayName } = useCommunityAuthor();
  const post = useCommunityStore((s) => (postId ? s.getPost(postId) : undefined));
  const updatePost = useCommunityStore((s) => s.updatePost);

  if (!post || !postId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-[104px]">
        <p className={typeBodySm}>게시글을 찾을 수 없어요.</p>
      </div>
    );
  }

  useEffect(() => {
    if (post && post.authorNickname !== displayName) {
      navigate(`/community/${postId}`, { replace: true });
    }
  }, [post, displayName, navigate, postId]);

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
          onClick={() => navigate(`/community/${postId}`)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="뒤로"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      }
    >
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PostEditor
          initial={post}
          onCancel={() => navigate(`/community/${postId}`)}
          onSubmit={(payload) => {
            updatePost(postId, displayName, payload);
            navigate(`/community/${postId}`);
          }}
        />
      </div>
    </CommunityLayout>
  );
};

export default CommunityPostEdit;
