import type { LucideIcon } from 'lucide-react';
import { Activity, ClipboardList, FileText, Settings } from 'lucide-react';
import type { HomeActionDto } from '../types/backendApi';

export type HomeActionType = 'TEST' | 'BODY_STATUS' | 'GUIDE' | 'SETTINGS';

/** 홈 메인에 노출할 액션 (검사하기 · 검사 상세 리포트) */
export const HOME_PRIMARY_ACTION_TYPES: HomeActionType[] = ['TEST', 'GUIDE'];

const DEFAULT_TEST_ACTION: HomeActionDto = { type: 'TEST', title: '검사하기' };
const DEFAULT_GUIDE_ACTION: HomeActionDto = {
  type: 'GUIDE',
  title: '검사 상세 리포트',
};

export const DEFAULT_HOME_ACTIONS: HomeActionDto[] = [DEFAULT_TEST_ACTION, DEFAULT_GUIDE_ACTION];

const ACTION_SUBTITLES: Record<HomeActionType, string> = {
  TEST: '현재 상태를 건강하게 체크합니다',
  BODY_STATUS: '입력한 정보로 몸 상태를 확인해요',
  GUIDE: '누적된 건강 데이터를 확인하세요',
  SETTINGS: '알림·프로필을 관리해요',
};

const ACTION_ICONS: Record<HomeActionType, LucideIcon> = {
  TEST: ClipboardList,
  BODY_STATUS: Activity,
  GUIDE: FileText,
  SETTINGS: Settings,
};

export function normalizeHomeActionType(type: string | undefined): HomeActionType | null {
  if (!type) return null;
  const key = type.trim().toUpperCase();
  if (key === 'TEST' || key === 'BODY_STATUS' || key === 'GUIDE' || key === 'SETTINGS') {
    return key;
  }
  return null;
}

export function homeActionSubtitle(type: string | undefined): string {
  const t = normalizeHomeActionType(type);
  if (t) return ACTION_SUBTITLES[t];
  return '';
}

export function homeActionIcon(type: string | undefined): LucideIcon {
  const t = normalizeHomeActionType(type);
  if (t) return ACTION_ICONS[t];
  return ClipboardList;
}

export function resolveHomeActions(actions: HomeActionDto[] | undefined | null): HomeActionDto[] {
  if (!actions?.length) return DEFAULT_HOME_ACTIONS;
  const seen = new Set<HomeActionType>();
  const out: HomeActionDto[] = [];
  for (const a of actions) {
    const t = normalizeHomeActionType(a.type);
    if (!t || seen.has(t)) continue;
    seen.add(t);
    const defaultTitle = DEFAULT_HOME_ACTIONS.find((d) => d.type === t)?.title;
    const title =
      t === 'GUIDE'
        ? a.title?.trim() || defaultTitle || '검사 상세 리포트'
        : a.title?.trim() || defaultTitle || t;
    out.push({ type: t, title });
  }
  return out.length > 0 ? out : DEFAULT_HOME_ACTIONS;
}

/** 홈 CTA — TEST 항상, GUIDE는 recentTest 있을 때만 (백엔드·프론트 동일 규칙) */
export function resolveHomePrimaryActions(
  actions: HomeActionDto[] | undefined | null,
  options?: { hasRecentTest?: boolean },
): HomeActionDto[] {
  const hasRecentTest = options?.hasRecentTest === true;
  const allowedTypes: HomeActionType[] = hasRecentTest
    ? HOME_PRIMARY_ACTION_TYPES
    : ['TEST'];

  const resolved = resolveHomeActions(actions);
  const primary = resolved.filter((a) => {
    const t = normalizeHomeActionType(a.type);
    return t != null && allowedTypes.includes(t);
  });

  const typesToShow = allowedTypes;
  if (primary.length > 0) {
    return typesToShow.map((type) => {
      const found = primary.find((a) => normalizeHomeActionType(a.type) === type);
      if (found) return found;
      return type === 'GUIDE' ? DEFAULT_GUIDE_ACTION : DEFAULT_TEST_ACTION;
    });
  }

  return hasRecentTest
    ? [DEFAULT_TEST_ACTION, DEFAULT_GUIDE_ACTION]
    : [DEFAULT_TEST_ACTION];
}

export function getHomeActionPath(
  type: string | undefined,
  options?: { latestResultId?: number | null },
): string | null {
  const t = normalizeHomeActionType(type);
  if (!t) return null;

  switch (t) {
    case 'TEST':
      return '/inspection';
    case 'BODY_STATUS':
      return '/simulator?tab=body';
    case 'GUIDE':
      if (options?.latestResultId != null && options.latestResultId > 0) {
        return `/inspection-reports/detail?resultId=${String(options.latestResultId)}`;
      }
      return '/inspection-reports/archive';
    case 'SETTINGS':
      return '/settings';
    default:
      return null;
  }
}
