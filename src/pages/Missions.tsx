import { Check, Archive, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';

const missions = [
  {
    id: 'quit-smoking' as const,
    title: '금연하기',
    description: '오늘 담배를 피우지는 않으셨죠?',
  },
  {
    id: 'exercise-30' as const,
    title: '30분 운동하기',
    description: '조깅, 윗몸 일으키기 등 운동을 해주세요',
  },
  {
    id: 'sleep-7h' as const,
    title: '적정 수면시간 유지하기',
    description: '7시간 주무셨나요?',
  },
];

const Missions = () => {
  const navigate = useNavigate();
  const { level, xp, completed, toggleMission } = useBloomMissionsStore();

  const progress = Math.min(100, Math.max(0, xp));
  const stageLabel =
    level === 1
      ? 'Stage: Seed'
      : level === 2
        ? 'Stage: Sprout'
        : level === 3
          ? 'Stage: Small Plant'
          : level === 4
            ? 'Stage: Budding Flower'
            : 'Stage: Bloom';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative h-[844px] w-[390px] overflow-hidden rounded-[28px] shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
        </header>

        <main className="relative z-10 flex flex-1 flex-col px-5 pb-28 pt-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[13px] font-medium">뒤로</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/missions/archive')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md active:scale-[0.96]"
              aria-label="보관함으로 이동"
            >
              <Archive className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <h1 className="text-[24px] font-bold leading-tight tracking-[-0.3px] text-white">
              Mission
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-white/85">
              오늘의 작은 실천으로 씨앗을 피워 보세요.
            </p>
          </div>

          {/* Mission cards */}
          <section className="mt-6 space-y-3">
            {missions.map((m) => {
              const done = completed[m.id];
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-[22px] bg-white/20 px-4 py-3.5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.25)] ring-1 ring-white/35 backdrop-blur-md"
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
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-95 ${
                      done
                        ? 'bg-emerald-400 text-white'
                        : 'bg-white/85 text-[#FF3AA7]'
                    }`}
                    aria-label={done ? '완료 취소' : '미션 완료 +5 XP'}
                  >
                    {done ? <Check className="h-5 w-5" /> : '+5'}
                  </button>
                </div>
              );
            })}
          </section>

          {/* XP bar */}
          <section className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-white/85">
              <span>Level {level}</span>
              <span>{progress} / 100 XP</span>
            </div>
            <div className="mt-2 h-[10px] w-full overflow-hidden rounded-full bg-white/20 ring-1 ring-white/40">
              <div
                className="h-full rounded-full bg-white/90 transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {/* Plant area */}
          <section className="mt-7 flex-1">
            <div className="flex h-full items-center justify-center">
              <div className="flex h-[220px] w-full max-w-[320px] flex-col items-center justify-center rounded-[40px] bg-white/10 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-white/35 backdrop-blur-xl">
                <div className="relative mb-5 flex h-[120px] w-[120px] items-center justify-center">
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
                      <div className="absolute h-24 w-24 rounded-full bg-amber-200/20 blur-xl animate-spin-slow" />
                      <div className="h-16 w-1 rounded-full bg-emerald-700" />
                      <div className="mt-[-34px] flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                        <div className="h-8 w-8 rounded-full bg-emerald-300/90" />
                        <div className="h-6 w-6 rounded-full bg-emerald-400/90" />
                      </div>
                      <div className="mt-3 h-8 w-8 rounded-full bg-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.9)]" />
                    </div>
                  )}
                </div>
                <p className="text-[12px] font-semibold tracking-[0.08em] text-white/85">
                  {stageLabel}
                </p>
              </div>
            </div>
          </section>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Missions;
