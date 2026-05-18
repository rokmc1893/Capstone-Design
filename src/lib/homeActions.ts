import type { LucideIcon } from 'lucide-react';
import { Activity, ClipboardList, FileText, Settings } from 'lucide-react';
import type { HomeActionDto } from '../types/backendApi';

export type HomeActionType = 'TEST' | 'BODY_STATUS' | 'GUIDE' | 'SETTINGS';

export const DEFAULT_HOME_ACTIONS: HomeActionDto[] = [
  { type: 'TEST', title: '검사하기' },
  { type: 'BODY_STATUS', title: '내 몸상태 조회' },
  { type: 'GUIDE', title: '검사 상세 리포트' },
  { type: 'SETTINGS', title: '설정' },
];

const ACTION_SUBTITLES: Record<HomeActionType, string> = {
  TEST: '현재 상태를 간편하게 체크합니다',
  BODY_STATUS: '입력한 정보로 몸 상태를 확인해요',
  GUIDE: '최근 점수와 주요 요인을 한눈에',
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
    out.push({
      type: t,
      title: a.title?.trim() || DEFAULT_HOME_ACTIONS.find((d) => d.type === t)?.title || t,
    });
  }
  return out.length > 0 ? out : DEFAULT_HOME_ACTIONS;
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
