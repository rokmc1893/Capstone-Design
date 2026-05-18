import { useEffect, useRef, useState } from 'react';
import { Check, Archive, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { FlowerBloomCelebrationModal } from '../components/FlowerBloomCelebrationModal';
import {
  GROWTH_STAGE_LABELS,
  getMissionFlower,
  getMissionFlowerStageImageSrc,
  pickRandomMissionFlowerId,
} from '../data/missionFlowers';
import type { MissionFlower } from '../data/missionFlowers';
import { missionsFromResultReport, type BloomMissionRow } from '../lib/bloomMissionsFromReport';
import {
  fetchHomeDashboard,
  fetchMissionsToday,
  pickDailyRewardCapFromHome,
  pickSproutFromHome,
  postMissionComplete,
  todayMissionNumericId,
} from '../lib/homeMissionsApi';
import { missionErrorMessage } from '../lib/missionApiMessages';
import { fetchLatestResultReport, fetchLatestResultReportForHome } from '../lib/resultReport';
import { useAuthStore } from '../store/useAuthStore';
import {
  DAILY_REWARD_CAP_MESSAGE,
  isDailyRewardCapActive,
  useBloomMissionsStore,
} from '../store/useBloomMissionsStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import {
  typeCaption,
  typeCaptionXs,
  typeCardDesc,
  typeCardTitle,
  typeOverline,
  typeScreenTitle,
} from '../lib/typography';

const MISSION_SURFACE =
  'rounded-[24px] bg-white/20 shadow-[0_16px_40px_rgba(15,23,42,0.25)] ring-1 ring-white/35 backdrop-blur-md';

const Missions = () => {
  const navigate = useNavigate();
  const nickname = useUserProfileStore((s) => s.nickname || s.name);
  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);

  const accessToken = useAuthStore((s) => s.accessToken);

  const [missionRows, setMissionRows] = useState<BloomMissionRow[]>(() =>
    missionsFromResultReport(undefined),
  );
  const [missionSource, setMissionSource] = useState<'api' | 'report'>('report');
  const [missionBanner, setMissionBanner] = useState<string | null>(null);

  const markMissionCompleted = useBloomMissionsStore((s) => s.markMissionCompleted);
  const applyHomeSprout = useBloomMissionsStore((s) => s.applyHomeSprout);
  const syncDailyRewardCapReached = useBloomMissionsStore((s) => s.syncDailyRewardCapReached);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const snapshot = useSimulatorStore.getState();
      try {
        if (hasApiBase && accessToken) {
          const [todayPayload, home] = await Promise.all([fetchMissionsToday(), fetchHomeDashboard()]);
          if (!mounted) return;
          const sprout = pickSproutFromHome(home);
          if (sprout) applyHomeSprout({ level: sprout.level, exp: sprout.exp });
          const capFromHome = pickDailyRewardCapFromHome(home);
          if (capFromHome) syncDailyRewardCapReached(true);
          if (todayPayload.dailyRewardCapReached) syncDailyRewardCapReached(true);

          const rows: BloomMissionRow[] = [];
          for (const t of todayPayload.missions) {
            const mid = todayMissionNumericId(t);
            if (mid == null) continue;
            const rowId = `api:${mid}`;
            if (t.completed) markMissionCompleted(rowId);
            rows.push({
              id: rowId,
              title: t.title ?? '미션',
              description: t.description ?? t.content ?? '',
            });
          }
          if (rows.length > 0) {
            setMissionSource('api');
            setMissionRows(rows);
            return;
          }
        }

        const fromApi = hasApiBase ? await fetchLatestResultReportForHome() : null;
        const report = fromApi ?? (await fetchLatestResultReport(snapshot, nickname));
        if (mounted) {
          setMissionSource('report');
          setMissionRows(missionsFromResultReport(report));
        }
      } catch {
        if (!mounted) return;
        try {
          const report = await fetchLatestResultReport(snapshot, nickname);
          if (mounted) {
            setMissionSource('report');
            setMissionRows(missionsFromResultReport(report));
          }
        } catch {
          if (mounted) {
            setMissionSource('report');
            setMissionRows(missionsFromResultReport(undefined));
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [
    hasApiBase,
    nickname,
    accessToken,
    applyHomeSprout,
    markMissionCompleted,
    syncDailyRewardCapReached,
  ]);
  const level = useBloomMissionsStore((s) => s.level);
  const xp = useBloomMissionsStore((s) => s.xp);
  const completed = useBloomMissionsStore((s) => s.completed);
  const blooms = useBloomMissionsStore((s) => s.blooms);
  const bloomRecords = useBloomMissionsStore((s) => s.bloomRecords);
  const selectedFlowerId = useBloomMissionsStore((s) => s.selectedFlowerId);
  const requiredExpForNext = useBloomMissionsStore((s) => s.requiredExpForNext);
  const dailyRewardCapDate = useBloomMissionsStore((s) => s.dailyRewardCapDate);
  const dailyRewardCapActive = isDailyRewardCapActive(dailyRewardCapDate);
  const toggleMission = useBloomMissionsStore((s) => s.toggleMission);
  const applyMissionCompleteDto = useBloomMissionsStore((s) => s.applyMissionCompleteDto);

  useEffect(() => {
    const s = useBloomMissionsStore.getState();
    if (s.level === 1 && s.xp === 0 && s.blooms === 0) {
      s.setSelectedFlower(pickRandomMissionFlowerId());
    }
  }, []);

  const selectedFlower = getMissionFlower(selectedFlowerId);
  const stageImageSrc = getMissionFlowerStageImageSrc(selectedFlower, level);
  const xpCap = requiredExpForNext ?? 100;
  const xpBarPercent = Math.min(100, Math.max(0, xpCap > 0 ? (xp / xpCap) * 100 : 0));

  const [completingMissionId, setCompletingMissionId] = useState<string | null>(null);

  const handleMissionToggle = async (m: BloomMissionRow) => {
    setMissionBanner(null);
    const done = completed[m.id];
    if (missionSource === 'api' && m.id.startsWith('api:')) {
      const missionId = Number.parseInt(m.id.slice(4), 10);
      if (!Number.isFinite(missionId) || done) return;
      setCompletingMissionId(m.id);
      try {
        const dto = await postMissionComplete(missionId);
        if (dto.alreadyCompleted) {
          markMissionCompleted(m.id);
          setMissionBanner('이미 완료된 미션이에요.');
          return;
        }
        applyMissionCompleteDto(dto);
        markMissionCompleted(m.id);
        if (dto.newFlower) {
          const last = useBloomMissionsStore.getState().bloomRecords.at(-1);
          if (last) setCelebrateFlower(getMissionFlower(last.flowerId));
        }
      } catch (e) {
        setMissionBanner(missionErrorMessage(e));
      } finally {
        setCompletingMissionId(null);
      }
      return;
    }
    toggleMission(m.id);
  };

  const [celebrateFlower, setCelebrateFlower] = useState<MissionFlower | null>(null);
  const prevBlooms = useRef(blooms);
  const skipBloomEffect = useRef(true);

  useEffect(() => {
    if (skipBloomEffect.current) {
      skipBloomEffect.current = false;
      prevBlooms.current = blooms;
      return;
    }
    if (blooms > prevBlooms.current) {
      const last = bloomRecords[bloomRecords.length - 1];
      if (last) setCelebrateFlower(getMissionFlower(last.flowerId));
    }
    prevBlooms.current = blooms;
  }, [blooms, bloomRecords]);

  const stages = [1, 2, 3, 4, 5] as const;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative flex h-[844px] w-[390px] flex-col min-h-0 overflow-hidden rounded-[28px] shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #A78BFA 0%, #F472B6 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#F472B6]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
        </header>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-[104px] pt-3">
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
                aria-label="뒤로 이동"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className={typeScreenTitle}>미션</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/missions/archive')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md active:scale-[0.96]"
              aria-label="보관함으로 이동"
            >
              <Archive className="h-5 w-5" />
            </button>
          </div>

          <p className={`mt-3.5 shrink-0 ${typeCaption}`}>
            최신 검사 결과를 바탕으로 미션이 구성됩니다. 완료할 때마다 경험치가 쌓이고, 단계가 올라가면 무작위로 정해진
            꽃이 자라요. 한 번 피우고 나면 다음에는 다른 꽃이 나올 수 있어요.
          </p>
          {dailyRewardCapActive ? (
            <p
              className={`mt-2.5 shrink-0 rounded-[12px] bg-black/20 px-3.5 py-2.5 ${typeCaptionXs} text-white/82`}
              role="status"
            >
              {DAILY_REWARD_CAP_MESSAGE}
            </p>
          ) : null}
          {missionBanner ? (
            <p className={`mt-2.5 shrink-0 rounded-[12px] bg-black/20 px-3.5 py-2.5 ${typeCaptionXs} text-white/82`}>
              {missionBanner}
            </p>
          ) : null}

          <section className={`mt-5 shrink-0 px-3 py-4 ${MISSION_SURFACE}`}>
            <p className={`mb-3 text-center ${typeOverline}`}>성장 단계</p>
            <div className="flex items-start justify-between gap-0.5 px-0.5">
              {stages.map((st, i) => {
                const done = level >= st;
                return (
                  <div key={st} className="relative flex min-w-0 flex-1 flex-col items-center">
                    {i < stages.length - 1 && (
                      <div
                        className={`absolute left-[calc(50%+14px)] top-[13px] z-0 h-[3px] w-[calc(100%-28px)] rounded-full ${
                          level > st ? 'bg-white/80' : 'bg-white/25'
                        }`}
                        aria-hidden
                      />
                    )}
                    <div
                      className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        done ? 'bg-white/95 text-pink-600 shadow-md' : 'bg-white/25 text-white/72'
                      }`}
                    >
                      {st}
                    </div>
                    <span className="mt-1.5 text-center text-[9px] font-medium leading-[1.35] tracking-[-0.01em] text-white/78">
                      {GROWTH_STAGE_LABELS[st]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={`mt-5 shrink-0 px-4 py-3.5 ${MISSION_SURFACE}`}>
            <div className={`flex items-center justify-between ${typeCaptionXs} font-semibold uppercase text-white/78`}>
              <span>
                단계 {level} · {selectedFlower.emoji} {selectedFlower.nameKo}
              </span>
              <span className="tabular-nums">
                {Math.round(xp)} / {xpCap} XP
              </span>
            </div>
            <div className="mt-2 h-[10px] w-full overflow-hidden rounded-full bg-white/20 ring-1 ring-white/40">
              <div
                className="h-full rounded-full bg-white/90 transition-[width] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ width: `${xpBarPercent}%` }}
              />
            </div>
          </section>

          <section className="mt-5 shrink-0 space-y-3">
            {missionRows.map((m) => {
              const done = completed[m.id];
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3.5 px-5 py-4 text-left ${MISSION_SURFACE}`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`${typeCardTitle} ${
                        done ? 'text-white/55 line-through' : ''
                      }`}
                    >
                      {m.title}
                    </p>
                    <p
                      className={`mt-1.5 ${typeCardDesc} ${
                        done ? 'text-white/40 line-through' : ''
                      }`}
                    >
                      {m.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={missionSource === 'api' && completingMissionId === m.id}
                    onClick={() => void handleMissionToggle(m)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-95 disabled:opacity-50 ${
                      done ? 'bg-emerald-400 text-white' : 'bg-white/90 text-[#FF3AA7]'
                    }`}
                    aria-label={
                      missionSource === 'api'
                        ? done
                          ? '완료됨'
                          : '미션 완료'
                        : done
                          ? '완료 취소'
                          : '미션 완료 +5 XP'
                    }
                  >
                    {done ? <Check className="h-5 w-5" /> : '+5'}
                  </button>
                </div>
              );
            })}
          </section>

          <section className="mt-6 flex shrink-0 flex-col">
            <div
              className={`flex w-full flex-col items-center justify-center px-4 py-5 ${MISSION_SURFACE}`}
            >
              <p className={`mb-3 ${typeCaption} text-white/82`}>
                {selectedFlower.nameKo} · {GROWTH_STAGE_LABELS[level]}
              </p>
              <div className="relative flex min-h-[140px] w-full max-w-[240px] items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                {stageImageSrc ? (
                  <img
                    src={stageImageSrc}
                    alt={`${selectedFlower.nameKo} ${GROWTH_STAGE_LABELS[level]}`}
                    className="max-h-[200px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_12px_28px_rgba(15,23,42,0.45)]"
                  />
                ) : (
                  <>
                    {level === 1 && (
                      <div className="h-8 w-8 rounded-full bg-amber-700 shadow-[0_0_0_6px_rgba(245,158,11,0.35)]" />
                    )}
                    {level === 2 && (
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-0.5 rounded-full bg-emerald-600" />
                        <div className="mt-[-26px] flex gap-2">
                          <div className="h-4 w-4 rounded-full bg-emerald-400/90" />
                          <div className="h-4 w-4 rounded-full bg-emerald-300/90" />
                        </div>
                      </div>
                    )}
                    {level === 3 && (
                      <div className="flex flex-col items-center">
                        <div className="h-14 w-1 rounded-full bg-emerald-600" />
                        <div className="mt-[-30px] flex gap-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-400/90" />
                          <div className="h-6 w-6 rounded-full bg-emerald-300/90" />
                          <div className="h-5 w-5 rounded-full bg-emerald-400/90" />
                        </div>
                      </div>
                    )}
                    {level === 4 && (
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-1 rounded-full bg-emerald-700" />
                        <div className="mt-[-34px] flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                          <div className="h-7 w-7 rounded-full bg-emerald-300/90" />
                          <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                        </div>
                        <div className="mt-3 h-4 w-4 rounded-full bg-pink-300" />
                      </div>
                    )}
                    {level === 5 && (
                      <div className="relative flex flex-col items-center">
                        <div className="absolute h-24 w-24 rounded-full bg-amber-200/25 blur-xl animate-spin-slow" />
                        <div className="h-16 w-1 rounded-full bg-emerald-700" />
                        <div className="mt-[-34px] flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                          <div className="h-8 w-8 rounded-full bg-emerald-300/90" />
                          <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                        </div>
                        <div className="mt-3 h-8 w-8 rounded-full bg-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.9)]" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>

        <FlowerBloomCelebrationModal
          flower={celebrateFlower ?? selectedFlower}
          open={celebrateFlower !== null}
          onClose={() => setCelebrateFlower(null)}
        />

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Missions;
