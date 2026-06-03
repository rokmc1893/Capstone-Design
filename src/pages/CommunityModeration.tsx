import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Flag, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { CommunityLayout } from '../components/community/CommunityLayout';
import { CommunityToast, type CommunityToastTone } from '../components/community/CommunityToast';
import { PremiumScrollArea } from '../components/ui/PremiumScrollArea';
import { formatCommunityDate } from '../lib/communityFormat';
import {
  buildBlockedAuthorRows,
  buildReportedPostRows,
} from '../lib/community/moderation';
import { glassCommunityPostCard } from '../components/ui/glassStyles';
import { useCommunityStore } from '../store/useCommunityStore';

type ModerationTab = 'reported' | 'blocked';

const CommunityModeration = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/community');
  const [tab, setTab] = useState<ModerationTab>('reported');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<CommunityToastTone>('success');

  const posts = useCommunityStore((s) => s.posts);
  const reportedPosts = useCommunityStore((s) => s.reportedPosts);
  const blockedUsers = useCommunityStore((s) => s.blockedUsers);
  const unreportPost = useCommunityStore((s) => s.unreportPost);
  const unblockUser = useCommunityStore((s) => s.unblockUser);
  const clearReportedPosts = useCommunityStore((s) => s.clearReportedPosts);
  const clearBlockedUsers = useCommunityStore((s) => s.clearBlockedUsers);

  const reportedRows = useMemo(
    () => buildReportedPostRows(reportedPosts, posts),
    [reportedPosts, posts],
  );
  const blockedRows = useMemo(
    () => buildBlockedAuthorRows(blockedUsers, posts),
    [blockedUsers, posts],
  );

  const showToast = useCallback((message: string, tone: CommunityToastTone = 'success') => {
    setToastTone(tone);
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (tab === 'reported' && reportedRows.length === 0 && blockedRows.length > 0) {
      setTab('blocked');
    }
  }, [tab, reportedRows.length, blockedRows.length]);

  const handleUnreport = (postId: string) => {
    if (unreportPost(postId)) showToast('글을 목록에 다시 표시해요');
    else showToast('처리하지 못했어요', 'default');
  };

  const handleUnblock = (authorNickname: string) => {
    if (unblockUser(authorNickname)) showToast('작성자 차단을 해제했어요');
    else showToast('처리하지 못했어요', 'default');
  };

  const handleClearReported = () => {
    if (reportedRows.length === 0) return;
    if (!window.confirm('신고한 글을 모두 목록에 다시 표시할까요?')) return;
    clearReportedPosts();
    showToast('신고한 글을 모두 다시 표시했어요');
  };

  const handleClearBlocked = () => {
    if (blockedRows.length === 0) return;
    if (!window.confirm('차단한 작성자를 모두 해제할까요?')) return;
    clearBlockedUsers();
    showToast('차단한 작성자를 모두 해제했어요');
  };

  const activeRows = tab === 'reported' ? reportedRows : blockedRows;
  const totalCount = reportedRows.length + blockedRows.length;

  return (
    <CommunityLayout
      title="숨김 · 차단 관리"
      subtitle="신고하거나 차단한 항목을 확인하고 해제할 수 있어요."
      showFab={false}
      headerScrolled={headerScrolled}
      headerExtra={
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
          aria-label="커뮤니티로"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      }
    >
      <CommunityToast message={toast} tone={toastTone} />

      <PremiumScrollArea
        showTopChrome
        className="mt-2 min-h-0"
        onScrollState={(s) => setHeaderScrolled(s.isScrolled)}
      >
        <div
          className="flex gap-2 rounded-[18px] border border-white/20 bg-white/[0.08] p-1 backdrop-blur-md"
          role="tablist"
          aria-label="관리 항목"
        >
          <TabButton
            active={tab === 'reported'}
            label={`신고한 글${reportedRows.length > 0 ? ` (${reportedRows.length})` : ''}`}
            icon={Flag}
            onClick={() => setTab('reported')}
          />
          <TabButton
            active={tab === 'blocked'}
            label={`차단한 작성자${blockedRows.length > 0 ? ` (${blockedRows.length})` : ''}`}
            icon={UserX}
            onClick={() => setTab('blocked')}
          />
        </div>

        {totalCount === 0 ? (
          <div
            className={`${glassCommunityPostCard} mt-6 flex flex-col items-center px-6 py-14 text-center`}
          >
            <p className="text-[16px] font-bold text-white/92">관리 중인 항목이 없어요</p>
            <p className="mt-3 text-[13px] leading-[1.65] text-white/55">
              글을 신고하거나 작성자를 차단하면
              <br />
              여기에서 확인하고 해제할 수 있어요.
            </p>
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="mt-6 rounded-full bg-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              커뮤니티로
            </button>
          </div>
        ) : activeRows.length === 0 ? (
          <div className={`${glassCommunityPostCard} mt-6 px-6 py-12 text-center`}>
            <p className="text-[14px] text-white/75">
              {tab === 'reported' ? '신고한 글이 없어요' : '차단한 작성자가 없어요'}
            </p>
          </div>
        ) : (
          <ul className="mt-5 space-y-3 pb-4">
            {tab === 'reported'
              ? reportedRows.map((row) => (
                  <li key={row.postId}>
                    <article className={`${glassCommunityPostCard} px-5 py-5`}>
                      <p className="text-[11px] font-semibold text-[#FF9AD0]">
                        {row.reasonLabel}
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-[15px] font-bold tracking-[-0.02em] text-white/95">
                        {row.title}
                      </h2>
                      <p className="mt-2 text-[13px] text-white/58">
                        {row.authorNickname}
                        {row.missing ? ' · 글 정보 없음' : ''}
                      </p>
                      <p className="mt-1 text-[12px] tabular-nums text-white/45">
                        신고 {formatCommunityDate(row.reportedAt)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {!row.missing ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/community/${row.postId}`)}
                            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[12px] font-semibold text-white/82"
                          >
                            글 보기
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleUnreport(row.postId)}
                          className="rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-[#7B6EE8]"
                        >
                          목록에 다시 표시
                        </button>
                      </div>
                    </article>
                  </li>
                ))
              : blockedRows.map((row) => (
                  <li key={row.authorNickname}>
                    <article className={`${glassCommunityPostCard} px-5 py-5`}>
                      <h2 className="text-[16px] font-bold tracking-[-0.02em] text-white/95">
                        {row.authorNickname}
                      </h2>
                      <p className="mt-2 text-[13px] text-white/58">
                        숨긴 글 {row.hiddenPostCount}개
                      </p>
                      <p className="mt-1 text-[12px] tabular-nums text-white/45">
                        차단 {formatCommunityDate(row.blockedAt)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleUnblock(row.authorNickname)}
                        className="mt-4 rounded-full bg-white px-3.5 py-2 text-[12px] font-semibold text-[#7B6EE8]"
                      >
                        차단 해제
                      </button>
                    </article>
                  </li>
                ))}
          </ul>
        )}

        {tab === 'reported' && reportedRows.length > 0 ? (
          <button
            type="button"
            onClick={handleClearReported}
            className="mb-6 w-full rounded-[16px] border border-white/18 py-3 text-[14px] font-semibold text-white/65"
          >
            신고한 글 모두 다시 표시
          </button>
        ) : null}
        {tab === 'blocked' && blockedRows.length > 0 ? (
          <button
            type="button"
            onClick={handleClearBlocked}
            className="mb-6 w-full rounded-[16px] border border-white/18 py-3 text-[14px] font-semibold text-white/65"
          >
            차단한 작성자 모두 해제
          </button>
        ) : null}
      </PremiumScrollArea>
    </CommunityLayout>
  );
};

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof Flag;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        'relative flex flex-1 items-center justify-center gap-1 rounded-[14px] px-1 py-3 transition active:scale-[0.98]',
        active ? 'bg-white shadow-[0_4px_14px_rgba(123,110,232,0.18)]' : '',
      ].join(' ')}
    >
      <Icon
        className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-[#7B6EE8]' : 'text-white/65'}`}
        strokeWidth={2}
        aria-hidden
      />
      <span
        className={`text-[11px] font-semibold leading-tight tracking-[-0.02em] ${
          active ? 'text-[#7B6EE8]' : 'text-white/78'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default CommunityModeration;
