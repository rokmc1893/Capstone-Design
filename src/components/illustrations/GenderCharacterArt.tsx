type GenderCharacterArtProps = {
  variant: 'male' | 'female';
  className?: string;
};

/** unDraw/Storyset 느낌의 인라인 벡터 일러스트 (외부 URL 없음) */
export function GenderCharacterArt({ variant, className = '' }: GenderCharacterArtProps) {
  if (variant === 'male') {
    return (
      <svg
        viewBox="0 0 160 200"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <ellipse cx="80" cy="188" rx="52" ry="8" fill="#5B8DEF" fillOpacity="0.2" />
        <circle cx="80" cy="52" r="28" fill="#7EB0FF" />
        <path
          d="M48 88c0-18 14-32 32-32s32 14 32 32v52c0 8-6 14-14 14H62c-8 0-14-6-14-14V88z"
          fill="#6BA3FF"
        />
        <path d="M58 118h44v38c0 6-5 11-11 11H69c-6 0-11-5-11-11v-38z" fill="#4F8FE8" />
        <circle cx="72" cy="50" r="3" fill="#1E3A5F" />
        <circle cx="88" cy="50" r="3" fill="#1E3A5F" />
        <path d="M74 58c4 3 8 3 12 0" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
        <rect x="36" y="100" width="18" height="8" rx="4" fill="#8FC0FF" />
        <rect x="106" y="100" width="18" height="8" rx="4" fill="#8FC0FF" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 160 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="80" cy="188" rx="52" ry="8" fill="#E879A9" fillOpacity="0.25" />
      <circle cx="80" cy="50" r="28" fill="#F5B8D4" />
      <path
        d="M44 92c0-16 16-28 36-28s36 12 36 28v48c0 10-8 18-18 18H62c-10 0-18-8-18-18V92z"
        fill="#F0A6C8"
      />
      <path d="M54 108h52v42c0 8-7 14-15 14H69c-8 0-15-6-15-14v-42z" fill="#E891B8" />
      <circle cx="72" cy="48" r="3" fill="#5C2D42" />
      <circle cx="88" cy="48" r="3" fill="#5C2D42" />
      <path d="M74 56c4 3 8 3 12 0" stroke="#5C2D42" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M52 62c-8 12-6 28 8 36M108 62c8 12 6 28-8 36"
        stroke="#E8A4C4"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
