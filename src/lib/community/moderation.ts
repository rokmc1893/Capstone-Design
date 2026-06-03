import type {
  CommunityBlockedUser,
  CommunityPost,
  CommunityReportRecord,
} from '../../types/community';
import { getReportReasonLabel } from './reportReasons';

export type ReportedPostRow = {
  postId: string;
  reasonLabel: string;
  reportedAt: string;
  title: string;
  authorNickname: string;
  /** 게시글 데이터가 없을 때 */
  missing: boolean;
};

export type BlockedAuthorRow = {
  authorNickname: string;
  blockedAt: string;
  hiddenPostCount: number;
};

export function buildReportedPostRows(
  reportedPosts: CommunityReportRecord[],
  posts: CommunityPost[],
): ReportedPostRow[] {
  const byId = new Map(posts.map((p) => [p.id, p]));
  return [...reportedPosts]
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
    .map((record) => {
      const post = byId.get(record.postId);
      return {
        postId: record.postId,
        reasonLabel: getReportReasonLabel(record.reason),
        reportedAt: record.reportedAt,
        title: post?.title ?? '삭제되었거나 찾을 수 없는 글',
        authorNickname: post?.authorNickname ?? '알 수 없음',
        missing: !post,
      };
    });
}

export function buildBlockedAuthorRows(
  blockedUsers: CommunityBlockedUser[],
  posts: CommunityPost[],
): BlockedAuthorRow[] {
  const countByAuthor = new Map<string, number>();
  for (const p of posts) {
    countByAuthor.set(p.authorNickname, (countByAuthor.get(p.authorNickname) ?? 0) + 1);
  }

  return [...blockedUsers]
    .sort((a, b) => b.blockedAt.localeCompare(a.blockedAt))
    .map((blocked) => ({
      authorNickname: blocked.authorNickname,
      blockedAt: blocked.blockedAt,
      hiddenPostCount: countByAuthor.get(blocked.authorNickname) ?? 0,
    }));
}

export function isPostHiddenFromFeed(
  postId: string,
  authorNickname: string,
  reportedPostIds: Set<string>,
  blockedAuthors: Set<string>,
): boolean {
  return reportedPostIds.has(postId) || blockedAuthors.has(authorNickname);
}
