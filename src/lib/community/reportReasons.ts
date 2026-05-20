import type { CommunityReportReason } from '../../types/community';

export const COMMUNITY_REPORT_REASONS: {
  id: CommunityReportReason;
  label: string;
}[] = [
  { id: 'inappropriate', label: '부적절한 내용' },
  { id: 'abuse', label: '욕설 / 비방' },
  { id: 'spam', label: '광고 / 스팸' },
  { id: 'misinformation', label: '허위 정보' },
  { id: 'other', label: '기타' },
];
