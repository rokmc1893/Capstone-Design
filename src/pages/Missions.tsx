import { useEffect, useRef, useState } from 'react';
import { Check, Archive, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { FlowerBloomCelebrationModal } from '../components/FlowerBloomCelebrationModal';
import {
  FLOWER_GROUPS,
  GROWTH_STAGE_LABELS,
  MISSION_FLOWERS,
  getMissionFlower,
  getMissionFlowerStageImageSrc,
} from '../data/missionFlowers';
import type { MissionFlower } from '../data/missionFlowers';
import { missionsFromResultReport, type BloomMissionRow } from '../lib/bloomMissionsFromReport';
import { fetchLatestResultReport, fetchLatestResultReportForHome } from '../lib/resultReport';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

const Missions = () => {
  const navigate = useNavigate();
  const nickname = useUserProfileStore((s) => s.nickname || s.name);
  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);

  const [missionRows, setMissionRows] = useState<BloomMissionRow[]>(() =>
    missionsFromResultReport(undefined),
  );

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const snapshot = useSimulatorStore.getState();
      try {
        const fromApi = hasApiBase ? await fetchLatestResultReportForHome() : null;
        const report = fromApi ?? (await fetchLatestResultReport(snapshot, nickname));
        if (mounted) setMissionRows(missionsFromResultReport(report));
      } catch {
        if (!mounted) return;
        try {
          const report = await fetchLatestResultReport(snapshot, nickname);
          if (mounted) setMissionRows(missionsFromResultReport(report));
        } catch {
          if (mounted) setMissionRows(missionsFromResultReport(undefined));
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hasApiBase, nickname]);
  const level = useBloomMissionsStore((s) => s.level);
  const xp = useBloomMissionsStore((s) => s.xp);
  const completed = useBloomMissionsStore((s) => s.completed);
  const blooms = useBloomMissionsStore((s) => s.blooms);
  const bloomRecords = useBloomMissionsStore((s) => s.bloomRecords);
  const selectedFlowerId = useBloomMissionsStore((s) => s.selectedFlowerId);
  const setSelectedFlower = useBloomMissionsStore((s) => s.setSelectedFlower);
  const toggleMission = useBloomMissionsStore((s) => s.toggleMission);

  const selectedFlower = getMissionFlower(selectedFlowerId);
  const stageImageSrc = getMissionFlowerStageImageSrc(selectedFlower, level);
  const progress = Math.min(100, Math.max(0, xp));

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
        className="relative h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden rounded-[28px] shadow-xl"
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

        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-5 pb-28 pt-3">
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
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.3px] text-white">미션</h1>
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

          <p className="mt-3 shrink-0 text-[12px] leading-snug text-white/85">
            최신 검사 결과를 바탕으로 미션이 구성됩니다. 완료할 때마다 경험치가 쌓이고, 단계가 올라가면 선택한 꽃이
            자라요.
          </p>

          <section className="mt-5 shrink-0 space-y-4">
            {FLOWER_GROUPS.map((group) => (
              <div key={group.id}>
                <div
                  className={`mb-2 inline-flex max-w-full rounded-full bg-gradient-to-r px-3 py-1.5 shadow-md ${group.barClass}`}
                >
                  <p className="text-[10px] font-bold leading-tight text-white">{group.titleKo}</p>
                </div>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {MISSION_FLOWERS.filter((f) => f.groupId === group.id).map((f) => {
                    const active = f.id === selectedFlowerId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFlower(f.id)}
                        className={`flex min-w-[78px] shrink-0 flex-col items-center rounded-[18px] px-2.5 py-2 text-left shadow-md ring-1 ring-white/30 backdrop-blur-md transition-transform active:scale-[0.97] ${
                          active ? 'bg-white/35 ring-2 ring-white' : 'bg-white/15'
                        }`}
                      >
                        <span className="text-[22px] leading-none" aria-hidden>
                          {f.emoji}
                        </span>
                        <span className="mt-1 text-center text-[11px] font-bold leading-tight text-white">
                          {f.nameKo}
                        </span>
                        <span className="mt-0.5 text-center text-[9px] font-medium leading-tight text-white/75 line-clamp-2">
                          {f.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="mt-5 shrink-0">
            <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-white/90">
              성장 단계
            </p>
            <div className="flex items-start justify-between gap-0.5">
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
                      className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        done ? 'bg-white text-pink-600 shadow-md' : 'bg-white/25 text-white/75'
                      }`}
                    >
                      {st}
                    </div>
                    <span className="mt-1.5 text-center text-[9px] font-semibold leading-[1.15] text-white/90">
                      {GROWTH_STAGE_LABELS[st]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-5 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-white/85">
              <span>
                단계 {level} · {selectedFlower.emoji} {selectedFlower.nameKo}
              </span>
              <span>{progress} / 100 XP</span>
            </div>
            <div className="mt-2 h-[10px] w-full overflow-hidden rounded-full bg-white/20 ring-1 ring-white/40">
              <div
                className="h-full rounded-full bg-white/90 transition-[width] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          <section className="mt-5 shrink-0 space-y-3">
            {missionRows.map((m) => {
              const done = completed[m.id];
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-[24px] bg-white/20 px-4 py-3.5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.25)] ring-1 ring-white/35 backdrop-blur-md"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[15px] font-semibold tracking-[-0.2px] ${
                        done ? 'text-white/60 line-through' : 'text-white'
                      }`}
                    >
                      {m.title}
                    </p>
                    <p
                      className={`mt-1 text-[12px] leading-snug ${
                        done ? 'text-white/45 line-through' : 'text-white/80'
                      }`}
                    >
                      {m.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMission(m.id)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-95 ${
                      done ? 'bg-emerald-400 text-white' : 'bg-white/90 text-[#FF3AA7]'
                    }`}
                    aria-label={done ? '완료 취소' : '미션 완료 +5 XP'}
                  >
                    {done ? <Check className="h-5 w-5" /> : '+5'}
                  </button>
                </div>
              );
            })}
          </section>

          <section className="mt-6 flex shrink-0 flex-col pb-2">
            <div className="flex w-full flex-col items-center justify-center rounded-[40px] bg-white/10 px-3 py-5 shadow-[inset_0_1px_18px_rgba(255,255,255,0.22),0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-white/35 backdrop-blur-xl">
              <p className="mb-3 text-[11px] font-semibold text-white/90">
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
