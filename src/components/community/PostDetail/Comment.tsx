import { memo, useState } from 'react';
import { Pin, Send, Trash2 } from 'lucide-react';
import { formatCommunityDate } from '../../../lib/communityFormat';
import type { CommunityComment } from '../../../types/community';
import { glassCommunityPostCard } from '../../ui/glassStyles';
import {
  typeCommunityPostAuthor,
  typeCommunityPostBody,
  typeCommunityPostMeta,
} from '../../../lib/typography';
import { LikeButton } from '../shared/LikeButton';
import { UserAvatar } from '../shared/UserAvatar';

const SURFACE = `${glassCommunityPostCard} px-4 py-3.5`;
const PINNED_SURFACE = `${glassCommunityPostCard} px-4 py-3.5 ring-1 ring-white/20`;

type CommentProps = {
  comment: CommunityComment;
  depth?: number;
  liked: boolean;
  isCommentAuthor: boolean;
  isPostAuthor: boolean;
  isPinned?: boolean;
  onToggleLike: () => void;
  onPin?: () => void;
  onReply: (parentId: string) => void;
  onUpdate: (commentId: string, body: string) => void;
  onDelete: (commentId: string) => void;
  replyToId: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
};

export const CommentItem = memo(function CommentItem({
  comment,
  depth = 0,
  liked,
  isCommentAuthor,
  isPostAuthor,
  isPinned = false,
  onToggleLike,
  onPin,
  onReply,
  onUpdate,
  onDelete,
  replyToId,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
}: CommentProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const isReplying = replyToId === comment.id;

  return (
    <li
      className={depth > 0 ? 'border-l-2 border-white/20 pl-3' : undefined}
      style={depth > 0 ? { marginLeft: `${Math.min(depth, 3) * 12 + 8}px` } : undefined}
    >
      <div className={isPinned ? PINNED_SURFACE : SURFACE}>
        <div className="flex gap-2">
          <UserAvatar name={comment.authorNickname} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={typeCommunityPostAuthor}>{comment.authorNickname}</p>
              {isPinned ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90">
                  <Pin className="h-3 w-3" aria-hidden />
                  고정
                </span>
              ) : null}
            </div>
            {editing ? (
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="mt-2 w-full rounded-[12px] border border-white/25 bg-white/10 px-3 py-2 text-[13px] text-white"
              />
            ) : (
              <p className={`mt-2 whitespace-pre-wrap ${typeCommunityPostBody}`}>{comment.body}</p>
            )}
            <p className={`mt-1.5 tabular-nums ${typeCommunityPostMeta}`}>
              {formatCommunityDate(comment.createdAt)}
              {comment.updatedAt ? ' · 수정됨' : ''}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <LikeButton
            count={comment.likeUserIds.length}
            active={liked}
            onToggle={onToggleLike}
            size="sm"
          />
          {depth < 2 ? (
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="text-[12px] font-semibold text-white/65"
            >
              답글
            </button>
          ) : null}
          {isPostAuthor && onPin ? (
            <button
              type="button"
              onClick={onPin}
              className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${
                isPinned ? 'text-white' : 'text-white/65'
              }`}
              aria-pressed={isPinned}
            >
              <Pin className="h-3.5 w-3.5" aria-hidden />
              {isPinned ? '고정 해제' : '고정'}
            </button>
          ) : null}
          {isCommentAuthor ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (editing) {
                    onUpdate(comment.id, editText);
                    setEditing(false);
                  } else {
                    setEditText(comment.body);
                    setEditing(true);
                  }
                }}
                className="text-[12px] font-semibold text-white/65"
              >
                {editing ? '저장' : '수정'}
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="inline-flex items-center gap-0.5 text-[12px] text-rose-200"
                aria-label="댓글 삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          ) : null}
        </div>

        {isReplying ? (
          <div className="mt-3 border-t border-white/15 pt-3">
            <textarea
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              rows={2}
              placeholder="답글을 입력하세요"
              className="w-full rounded-[12px] border border-white/25 bg-white/10 px-3 py-2 text-[13px] text-white placeholder:text-white/45"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onCancelReply}
                className="flex-1 rounded-[12px] bg-white/12 py-2 text-[12px] font-semibold text-white/80"
              >
                취소
              </button>
              <button
                type="button"
                onClick={onSubmitReply}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-[12px] bg-white/90 py-2 text-[12px] font-semibold text-[#7B6EE8]"
              >
                <Send className="h-3.5 w-3.5" />
                등록
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
});
