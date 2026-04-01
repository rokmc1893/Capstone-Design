import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';

const MissionsArchive = () => {
  const navigate = useNavigate();
  const blooms = useBloomMissionsStore((s) => s.blooms);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/missions')}
              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[13px] font-medium">Mission</span>
            </button>
          </div>

          <div className="mt-4">
            <h1 className="text-[22px] font-bold leading-tight tracking-[-0.3px] text-white">
              보관함
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-white/85">
              레벨 5에 도달해 만개한 꽃들이 여기에 쌓여요.
            </p>
          </div>

          <section className="mt-8 flex-1">
            {blooms <= 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-white/80">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10">
                  <div className="h-9 w-9 rounded-full bg-pink-200/60" />
                </div>
                <p className="text-[14px] font-medium">
                  아직 꽃이 자라나지 않았어요.
                </p>
                <p className="mt-1 text-[12px] text-white/75">
                  미션을 완료해서 꽃을 키워 주세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 pt-2">
                {Array.from({ length: blooms }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-[20px] bg-white/15 p-3 shadow-[0_10px_32px_rgba(15,23,42,0.4)] ring-1 ring-white/30 backdrop-blur-md"
                  >
                    <div className="relative mb-2 flex h-16 w-16 items-center justify-center">
                      <div className="absolute h-16 w-16 rounded-full bg-amber-200/25 blur-lg" />
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-0.5 rounded-full bg-emerald-700" />
                        <div className="mt-[-22px] flex gap-1.5">
                          <div className="h-4 w-4 rounded-full bg-emerald-400/90" />
                          <div className="h-5 w-5 rounded-full bg-emerald-300/90" />
                          <div className="h-4 w-4 rounded-full bg-emerald-400/90" />
                        </div>
                        <div className="mt-2 h-5 w-5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-white">Bloom</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default MissionsArchive;

