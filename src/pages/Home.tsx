import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ClipboardList, Activity, Heart } from 'lucide-react';
import { BottomTabNav } from '../components/BottomTabNav';
import { useUserProfileStore } from '../store/useUserProfileStore';

const Home = () => {
  const navigate = useNavigate();
  const userName = useUserProfileStore((s) => s.name);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        className="relative w-[390px] h-[844px] overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        {/* 설정 화면과 동일한 배경(그라데이션 + 소프트 글로우) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        {/* 상단 바 */}
        <div className="relative z-10 flex items-start justify-between px-6 pt-12">
          <div className="min-w-0">
            <p className="text-[16px] leading-[22px] font-bold tracking-[-0.2px] text-white">
              반가워요, {userName} 님!
            </p>
            <p className="mt-2 text-[24px] font-bold leading-[30px] tracking-[-0.4px] text-white">
              오늘 하루도
              <br />
              좋은 결과가 있길
            </p>
          </div>
          <button
            type="button"
            aria-label="설정"
            onClick={() => navigate('/settings')}
            className="relative ml-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/50 backdrop-blur-md active:scale-[0.98]"
          >
            <SettingsIcon className="h-5 w-5 text-blackBg" />
          </button>
        </div>

        {/* 메인 액션 (세로 3개 큰 버튼) */}
        <div className="relative z-10 mt-8 px-6 pb-28">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/inspection')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div>
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사하기
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  현재 상태를 간편하게 체크합니다
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <ClipboardList className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/simulator?tab=body')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div>
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  내 몸상태 조회
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  누적된 건강 데이터를 확인해요
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <Activity className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/simulator?tab=actions')}
              className="group relative flex h-[92px] w-full items-center justify-between rounded-[22px] bg-white/12 px-6 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
            >
              <div>
                <p className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-white">
                  검사 상세 리포트
                </p>
                <p className="mt-1 text-[12px] leading-[18px] text-white/80">
                  최근 점수와 주요 요인을 한눈에
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/30 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.8)] ring-1 ring-white/40">
                <Heart className="h-6 w-6 text-white/80" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
            </button>
          </div>
        </div>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default Home;