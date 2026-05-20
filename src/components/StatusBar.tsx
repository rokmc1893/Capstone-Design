type StatusBarProps = {
  className?: string;
};

/**
 * OS 상태바(시간·신호·Wi‑Fi·배터리)는 웹 앱 안에서 그릴 수 없습니다.
 * 기기·브라우저가 제공하는 영역만 비워 두고, `env(safe-area-inset-top)`으로
 * 노치·다이나믹 아일랜드·삼성 상단바 아래에 콘텐츠가 겹치지 않게 합니다.
 */
export function StatusBar({ className = '' }: StatusBarProps) {
  return (
    <div
      className={`shrink-0 w-full ${className}`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), var(--app-status-bar-min, 0px))',
      }}
      aria-hidden
    />
  );
}
