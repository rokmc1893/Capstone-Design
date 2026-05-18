import { api } from './api';
import type {
  FlowerCollectionEntryDto,
  HomeDashboardDto,
  HomeUserDto,
  MissionCompleteResponseDto,
  MissionHistoryPageDto,
  MissionsTodayResultDto,
  TodayMissionDto,
  UserMeDto,
} from '../types/backendApi';

export async function fetchHomeDashboard(): Promise<HomeDashboardDto | null> {
  if (!import.meta.env.VITE_API_BASE_URL) return null;
  try {
    return await api.get<HomeDashboardDto>('/home');
  } catch {
    return null;
  }
}

export async function fetchUserMe(): Promise<UserMeDto> {
  return api.get<UserMeDto>('/users/me');
}

export async function patchUserMe(body: {
  nickname?: string;
  profileImageUrl?: string | null;
}): Promise<UserMeDto> {
  return api.patch<UserMeDto>('/users/me', body);
}

export async function deleteUserMe(): Promise<void> {
  await api.delete<unknown>('/users/me');
}

export async function fetchMissionsMe(): Promise<TodayMissionDto[]> {
  const raw = await api.get<unknown>('/api/missions/me');
  return normalizeMissionList(raw);
}

export async function fetchMissionsToday(): Promise<TodayMissionDto[]> {
  const raw = await api.get<unknown>('/api/missions/today');
  return normalizeMissionList(raw);
}

function normalizeMissionList(raw: unknown): TodayMissionDto[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as TodayMissionDto[];
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as MissionsTodayResultDto & Record<string, unknown>;
    if (Array.isArray(o.missions)) return o.missions;
    const list = o.items ?? o.content;
    if (Array.isArray(list)) return list as TodayMissionDto[];
  }
  return [];
}

/** 홈 `user` 또는 미션 완료 응답으로 새싹 레벨·EXP 동기화용 */
export function pickSproutFromHome(home: HomeDashboardDto | null): HomeUserDto | null {
  return home?.user ?? null;
}

export function todayMissionNumericId(m: TodayMissionDto): number | null {
  const n = m.missionId ?? m.id;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

export async function postMissionComplete(missionId: number): Promise<MissionCompleteResponseDto> {
  return api.post<MissionCompleteResponseDto>(`/api/missions/${missionId}/complete`, {});
}

export async function fetchMissionHistoryPage(params: {
  lastLogId?: string | number;
  size?: number;
}): Promise<MissionHistoryPageDto> {
  const q = new URLSearchParams();
  if (params.lastLogId !== undefined && params.lastLogId !== '') q.set('lastLogId', String(params.lastLogId));
  if (params.size != null) q.set('size', String(params.size));
  const qs = q.toString();
  return api.get<MissionHistoryPageDto>(`/api/missions/history${qs ? `?${qs}` : ''}`);
}

export async function fetchFlowerCollections(): Promise<FlowerCollectionEntryDto[]> {
  const raw = await api.get<unknown>('/api/missions/collections');
  return normalizeFlowerCollections(raw);
}

function normalizeFlowerCollections(raw: unknown): FlowerCollectionEntryDto[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as FlowerCollectionEntryDto[];
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as Record<string, unknown>;
    const list = o.collections ?? o.items ?? o.content ?? o.flowers;
    if (Array.isArray(list)) return list as FlowerCollectionEntryDto[];
  }
  return [];
}

export async function postSproutResetAfterRetest(): Promise<unknown> {
  return api.post<unknown>('/missions/sprout/reset-after-retest', {});
}

export async function fetchResultsHistoryRaw(year?: number, month?: number): Promise<unknown> {
  const q = new URLSearchParams();
  if (year != null) q.set('year', String(year));
  if (month != null) q.set('month', String(month));
  const qs = q.toString();
  return api.get<unknown>(`/results/history${qs ? `?${qs}` : ''}`);
}
