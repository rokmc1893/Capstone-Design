import { useLocation, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { TapCounsel } from '../components/TapCounsel';
import image3 from '../assets/figma/home/image3.png';
import image5 from '../assets/figma/home/image5.png';
import image6 from '../assets/figma/home/image6.png';

type TabKey = 'home' | 'missions' | 'community';

const HomeFigma1125 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedTab: TabKey =
    location.pathname === '/simulator'
      ? 'missions'
      : location.pathname === '/login'
        ? 'community'
        : 'home';

  const userName = '영희';

  const bgTop = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 393 852' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.699999988079071'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.45 69.95 -32.266 0.66884 208 -75.5)'><stop stop-color='rgba(147,136,250,1)' offset='0'/><stop stop-color='rgba(169,160,251,1)' offset='0.0001'/><stop stop-color='rgba(212,207,253,1)' offset='0.50005'/><stop stop-color='rgba(255,255,255,1)' offset='1'/></radialGradient></defs></svg>")`;

  const bgBottom = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 393 852' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.699999988079071'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-38.95 -31.8 31.8 -38.95 41 827)'><stop stop-color='rgba(224,161,205,1)' offset='0.023728'/><stop stop-color='rgba(236,205,227,1)' offset='0.51186'/><stop stop-color='rgba(249,249,249,1)' offset='1'/></radialGradient></defs></svg>")`;

  const cardLeftBg = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 171 240' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.6899999976158142'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.1 24 -17.1 -0.07125 94 26.5)'><stop stop-color='rgba(240,83,175,1)' offset='0'/><stop stop-color='rgba(244,126,195,1)' offset='0.25'/><stop stop-color='rgba(248,168,215,1)' offset='0.5'/><stop stop-color='rgba(251,211,235,1)' offset='0.75'/><stop stop-color='rgba(255,254,254,1)' offset='1'/></radialGradient></defs></svg>")`;

  const cardRightBg = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 170 240' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.0000010112 24.45 -17.319 7.1624e-7 85 40.5)'><stop stop-color='rgba(174,178,245,1)' offset='0'/><stop stop-color='rgba(208,212,248,1)' offset='0.5'/><stop stop-color='rgba(242,247,251,1)' offset='1'/></radialGradient></defs></svg>")`;

  // (Figma 1:1125의 탭바 아이콘 배열은 현재 화면에서 사용하지 않아 제거)

  // NOTE:
  // 하단 탭바는 프로젝트 기존 구현을 그대로 유지하고,
  // Figma 1:1125의 본문(배경/카드/텍스트)을 전면 교체합니다.

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="relative w-[393px] h-[852px] overflow-hidden rounded-[28px] bg-white shadow-xl">
        {/* 배경 (Rectangle 2018 / 2019) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex-none h-[852px] w-[393px] rotate-180">
            <div className="size-full" style={{ backgroundImage: bgTop }} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex-none h-[852px] w-[393px] -scale-y-100">
            <div
              className="size-full opacity-50"
              style={{ backgroundImage: bgBottom }}
            />
          </div>
        </div>

        {/* 설정 버튼 */}
        <button
          type="button"
          aria-label="설정"
          onClick={() => navigate('/settings')}
          className="absolute left-[73.21%] right-[16.49%] top-[73px] -translate-x-1/2 flex h-[46px] w-[46px] items-center justify-center"
        >
          <div className="relative h-[46px] w-[46px]">
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-[2px] border border-[#e7e7e7]" />
            <Settings className="relative h-[20px] w-[20px] text-blackBg" />
          </div>
        </button>

        {/* 텍스트 */}
        <p className="absolute font-['Yeon_Sung:Regular',sans-serif] inset-[9.04%_61.04%_87.44%_12.09%] leading-[30px] not-italic text-[#202020] text-[20px] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.2px] whitespace-nowrap">
          반가워요, {userName} 님!
        </p>

        <div className="absolute inset-[13.5%_39.55%_78.29%_7.61%]">
          <p className="font-['Do_Hyeon:Regular',sans-serif] leading-[35px] not-italic text-[#202020] text-[40px] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.4px] whitespace-nowrap">
            오늘 하루도
          </p>
          <p className="mt-[2px] font-['Do_Hyeon:Regular',sans-serif] leading-[35px] not-italic text-[#202020] text-[40px] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.4px] whitespace-nowrap">
            좋은 결과가 있길
          </p>
        </div>

        {/* 카드 배경 (검사하기 / 내 몸상태 조회) */}
        <button
          type="button"
          onClick={() => navigate('/simulator?tab=inspection')}
          className="absolute border border-[#e7e7e7] border-solid inset-[28.87%_55.9%_42.96%_5.82%] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
          style={{ backgroundImage: cardLeftBg }}
          aria-label="검사하기"
        />

        <button
          type="button"
          onClick={() => navigate('/simulator?tab=body')}
          className="absolute border border-[#e7e7e7] border-solid inset-[28.87%_15.15%_42.96%_46.79%] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
          style={{ backgroundImage: cardRightBg }}
          aria-label="내 몸상태 조회"
        />

        <p className="absolute font-['Do_Hyeon:Regular',sans-serif] inset-[32.04%_18.73%_59.74%_51.27%] leading-[35px] not-italic text-[#202020] text-[40px] text-center text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.4px] whitespace-nowrap">
          <span className="block">내 몸상태</span>
          <span className="block">조회</span>
        </p>

        <p className="absolute font-['Do_Hyeon:Regular',sans-serif] inset-[32.63%_61.27%_63.85%_11.42%] leading-[30px] not-italic text-[#202020] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.4px] whitespace-nowrap">
          검사하기
        </p>

        {/* 검사 상세 리포트 배경 (기존 행동 가이드 카드 위치) */}
        <button
          type="button"
          onClick={() => navigate('/simulator?tab=actions')}
          className="absolute bg-gradient-to-b border border-[#e7e7e7] border-solid from-[#ebf4e0] inset-[58.45%_15.15%_25.12%_5.82%] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] to-[#c9f595] via-[#c9f595] via-[94.924%] size-full overflow-hidden"
          aria-label="검사 상세 리포트"
        />

        <p className="absolute font-['Do_Hyeon:Regular',sans-serif] inset-[64.91%_27.24%_30.99%_36.04%] leading-[35px] not-italic text-[#202020] text-[40px] text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] tracking-[-0.4px]">
          검사 상세 리포트
        </p>

        {/* 이미지들 */}
        <div className="absolute aspect-[512/512] left-[5.82%] right-[62.61%] top-[325px]">
          <img
            alt=""
            className="absolute max-w-none object-cover size-full pointer-events-none"
            src={image6}
          />
        </div>

        <div className="absolute aspect-[512/512] left-[49.93%] right-[15.15%] top-[343px]">
          <img
            alt=""
            className="absolute max-w-none object-cover size-full pointer-events-none"
            src={image3}
          />
        </div>

        <div className="absolute aspect-[512/512] left-[5.37%] right-[66.19%] top-[504px]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={image5}
          />
        </div>

        {/* 하단 탭바: 기존 구현 유지 (클릭 동작 포함) */}
        <div className="absolute bottom-8 left-1/2 z-20 w-[360px] -translate-x-1/2">
          <TapCounsel className="w-full h-[64px]">
            <div className="grid grid-cols-3 h-full items-center">
              <button
                type="button"
                className="relative flex h-full flex-col items-center justify-center gap-1"
                onClick={() => navigate('/home')}
              >
                {selectedTab === 'home' && (
                  <span className="pointer-events-none absolute -top-2 h-1 w-10 rounded-full bg-[#E11D48]" />
                )}
                <span className={selectedTab === 'home' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}>⌂</span>
                <span className={`text-[8px] leading-[22px] tracking-[-0.08px] ${selectedTab === 'home' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}`}>
                  홈
                </span>
              </button>

              <button
                type="button"
                className="relative flex h-full flex-col items-center justify-center gap-1"
                onClick={() => navigate('/simulator?tab=inspection')}
              >
                {selectedTab === 'missions' && (
                  <span className="pointer-events-none absolute -top-2 h-1 w-10 rounded-full bg-[#E11D48]" />
                )}
                <span className={selectedTab === 'missions' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}>▲</span>
                <span className={`text-[8px] leading-[22px] tracking-[-0.08px] ${selectedTab === 'missions' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}`}>
                  미션
                </span>
              </button>

              <button
                type="button"
                className="relative flex h-full flex-col items-center justify-center gap-1"
                onClick={() => navigate('/login')}
              >
                {selectedTab === 'community' && (
                  <span className="pointer-events-none absolute -top-2 h-1 w-10 rounded-full bg-[#E11D48]" />
                )}
                <span className={selectedTab === 'community' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}>⌒</span>
                <span className={`text-[8px] leading-[22px] tracking-[-0.08px] ${selectedTab === 'community' ? 'text-[#E11D48]' : 'text-[#9A9A98]'}`}>
                  커뮤니티
                </span>
              </button>
            </div>
          </TapCounsel>
        </div>
      </div>
    </div>
  );
};

export default HomeFigma1125;

