import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import type { CommunityComment } from '../../../types/community';
import { glassCard } from '../../ui/glassStyles';
import { typeBodySm, typeCaption } from '../../../lib/typography';
import { CommentItem } from './Comment';

const SURFACE = `${glassCard} px-4 py-4`;

type CommentSectionProps = {
  postId: string;
  comments: CommunityComment[];
  userId: string;
  displayName: string;
  isPostAuthor: boolean;
  pinnedCommentId: string | null;
  onAddComment: (body: string, parentId?: string) => void;
  onUpdateComment: (commentId: string, body: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  onPinComment?: (commentId: string) => void;
};

type CommentNode = CommunityComment & { children: CommentNode[] };

function buildCommentTree(comments: CommunityComment[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];
  for (const c of comments) {
    byId.set(c.id, { ...c, children: [] });
  }
  for (const c of comments) {
    const node = byId.get(c.id)!;
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortNodes = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function flattenTree(nodes: CommentNode[], depth = 0): { node: CommentNode; depth: number }[] {
  const out: { node: CommentNode; depth: number }[] = [];
  for (const n of nodes) {
    out.push({ node: n, depth });
    out.push(...flattenTree(n.children, depth + 1));
  }
  return out;
}

export function CommentSection({
  postId,
  comments,
  userId,
  displayName,
  isPostAuthor,
  pinnedCommentId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onToggleCommentLike,
  onPinComment,
}: CommentSectionProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const pinnedComment = useMemo(
    () => (pinnedCommentId ? comments.find((c) => c.id === pinnedCommentId) : undefined),
    [comments, pinnedCommentId],
  );

  const restComments = useMemo(
    () => (pinnedCommentId ? comments.filter((c) => c.id !== pinnedCommentId) : comments),
    [comments, pinnedCommentId],
  );

  const flat = useMemo(() => flattenTree(buildCommentTree(restComments)), [restComments]);

  const submitTop = () => {
    const body = text.trim();
    if (!body) {
      setError('댓글 내용을 입력해 주세요.');
      return;
    }
    onAddComment(body);
    setText('');
    setError(null);
  };

  const submitReply = () => {
    const body = replyText.trim();
    if (!replyToId || !body) return;
    onAddComment(body, replyToId);
    setReplyText('');
    setReplyToId(null);
  };

  const renderComment = (node: CommunityComment, depth: number, pinned = false) => (
    <CommentItem
      key={node.id}
      comment={node}
      depth={depth}
      liked={node.likeUserIds.includes(userId)}
      isCommentAuthor={node.authorNickname === displayName}
      isPostAuthor={isPostAuthor}
      isPinned={pinned}
      onToggleLike={() => onToggleCommentLike(node.id)}
      onPin={onPinComment ? () => onPinComment(node.id) : undefined}
      onReply={(id) => {
        setReplyToId(id);
        setReplyText('');
      }}
      onUpdate={onUpdateComment}
      onDelete={onDeleteComment}
      replyToId={replyToId}
      replyText={replyText}
      onReplyTextChange={setReplyText}
      onSubmitReply={submitReply}
      onCancelReply={() => {
        setReplyToId(null);
        setReplyText('');
      }}
    />
  );

  return (
    <section aria-label="댓글">
      <p className={`mb-3 ${typeCaption} font-semibold text-white/80`}>댓글 {comments.length}개</p>

      <ul className="space-y-3">
        {pinnedComment ? (
          <li>
            <p className="mb-1.5 pl-1 text-[11px] font-semibold text-white/55">고정된 댓글</p>
            {renderComment(pinnedComment, 0, true)}
          </li>
        ) : null}

        {flat.length === 0 && !pinnedComment ? (
          <li className={`${SURFACE} text-center ${typeBodySm} text-white/75`}>첫 댓글을 남겨 보세요.</li>
        ) : (
          flat.map(({ node, depth }) => renderComment(node, depth))
        )}
      </ul>

      <div className={`mt-4 ${SURFACE}`}>
        <label className={`${typeCaption} font-semibold text-white/80`} htmlFor={`comment-${postId}`}>
          댓글 작성
        </label>
        <textarea
          id={`comment-${postId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="댓글을 입력해 주세요"
          className="mt-2 w-full resize-none rounded-[14px] border border-white/25 bg-white/10 px-3.5 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-white/40 focus:outline-none"
        />
        {error ? <p className="mt-2 text-[12px] text-rose-200">{error}</p> : null}
        <button
          type="button"
          onClick={submitTop}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-white/90 py-3 text-[14px] font-semibold text-[#7B6EE8] active:scale-[0.98]"
        >
          <Send className="h-4 w-4" aria-hidden />
          등록
        </button>
      </div>
    </section>
  );
}
