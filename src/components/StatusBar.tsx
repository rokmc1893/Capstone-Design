type StatusBarProps = {
  className?: string;
};

/** iOS 스타일 신호 막대 (4칸, 채워진 형태) */
function SignalIcon() {
  const bars = [
    { x: 0, height: 4, y: 8 },
    { x: 4.5, height: 6.5, y: 5.5 },
    { x: 9, height: 9, y: 3 },
    { x: 13.5, height: 12, y: 0 },
  ];
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width="3.5"
          height={b.height}
          rx="1"
          fill="black"
        />
      ))}
    </svg>
  );
}

/** iOS 스타일 WiFi 아이콘 (3개 호 + 점) */
function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
      <path
        d="M8 9.5C8.69 9.5 9.25 10.06 9.25 10.75S8.69 12 8 12s-1.25-.56-1.25-1.25S7.31 9.5 8 9.5z"
        fill="black"
      />
      <path
        d="M8 6.2c1.18 0 2.24.5 3 1.3l1.1-1.1C10.9 5.18 9.5 4.6 8 4.6s-2.9.58-4.1 1.8L5 7.5c.76-.8 1.82-1.3 3-1.3z"
        fill="black"
      />
      <path
        d="M8 2.9c2.1 0 4 .85 5.38 2.22l1.1-1.1C12.86 2.38 10.55 1.4 8 1.4S3.14 2.38 1.52 4.02l1.1 1.1C3.99 3.75 5.9 2.9 8 2.9z"
        fill="black"
      />
    </svg>
  );
}

/** iOS 스타일 배터리 아이콘 */
function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden>
      {/* 배터리 몸체 */}
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="black" strokeOpacity="0.35" />
      {/* 배터리 캡 */}
      <path d="M23 4v4c.83-.37 1.4-1.2 1.4-2s-.57-1.63-1.4-2z" fill="black" fillOpacity="0.4" />
      {/* 충전량 (80%) */}
      <rect x="2" y="2" width="15.5" height="8" rx="2" fill="black" />
    </svg>
  );
}

function StatusBarDynamicIsland() {
  return (
    <div className="bg-black h-[34px] relative rounded-[100px] w-[120px]" />
  );
}

function StatusBarIOS({ className }: StatusBarProps) {
  return (
    <div
      className={`flex items-end justify-center h-[54px] px-3 ${className ?? ''}`}
    >
      <div className="flex flex-1 items-center justify-start pb-[4px] pl-[7px]">
        <p className="type-status-bar">
          9:41
        </p>
      </div>

      <div className="flex items-center justify-center pb-[3px]">
        <StatusBarDynamicIsland />
      </div>

      <div className="flex flex-1 items-center justify-end pb-[4px] pr-[9px] gap-[5px]">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

function StatusBarAndroid({ className }: StatusBarProps) {
  return (
    <div
      className={`flex h-[44px] items-center justify-between px-4 ${className ?? ''}`}
    >
      <span className="type-status-bar text-[14px]">9:41</span>
      <div className="flex items-center gap-[5px]">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

export function StatusBar({ className }: StatusBarProps) {
  const isAndroid =
    typeof navigator !== 'undefined' &&
    /Android/i.test(navigator.userAgent || '');

  if (isAndroid) {
    return <StatusBarAndroid className={className} />;
  }

  return <StatusBarIOS className={className} />;
}


