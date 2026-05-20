import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { PostEditor } from '../components/community/PostEditor/PostEditor';
import { useCommunityAuthor } from '../lib/community/useCommunityAuthor';
import { useCommunityStore } from '../store/useCommunityStore';
const CommunityPostWrite = () => {
  const navigate = useNavigate();
  const { displayName } = useCommunityAuthor();
  const addPost = useCommunityStore((s) => s.addPost);

  return (
    <CommunityLayout
      title="글쓰기"
      subtitle="카테고리·태그·사진을 넣어 이야기를 공유해 보세요."
      showFab={false}
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
      <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PostEditor
          onCancel={() => navigate('/community')}
          onSubmit={(payload) => {
            const id = addPost({ ...payload, authorNickname: displayName });
            navigate(`/community/${id}`);
          }}
        />
      </div>
    </CommunityLayout>
  );
};

export default CommunityPostWrite;
