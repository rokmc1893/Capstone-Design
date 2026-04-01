/** 공식 카카오톡 로고 에셋 (public/kakao-talk.png) */
const KAKAO_TALK_ICON = '/kakao-talk.png';

type KakaoLoginButtonProps = {
  onClick?: () => void;
  className?: string;
};

export function KakaoLoginButton({ onClick, className }: KakaoLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-[60px] w-full max-w-[320px] items-center justify-center gap-3 rounded-[24px] bg-[#FEE500] px-6 shadow-[0_18px_40px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.08)] transition active:scale-[0.98] active:shadow-[0_10px_24px_rgba(0,0,0,0.2)] ${className ?? ''}`}
    >
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        <img
          alt=""
          src={KAKAO_TALK_ICON}
          className="h-[34px] w-[34px] object-contain"
          width={34}
          height={34}
          aria-hidden
        />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.25px] text-[#191600]">
        카카오로 시작하기
      </span>
    </button>
  );
}

