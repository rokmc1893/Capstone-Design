import { BatteryFull, Wifi, Signal } from 'lucide-react';

type StatusBarProps = {
  className?: string;
};

function StatusBarDynamicIsland() {
  return (
    <div className="bg-black h-[37px] relative rounded-[100px] w-[125px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black h-[37px] left-[calc(50%-22.5px)] rounded-[100px] top-1/2 w-[80px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black left-[calc(50%+44px)] rounded-[100px] size-[37px] top-1/2" />
    </div>
  );
}

function StatusBarIOS({ className }: StatusBarProps) {
  return (
    <div
      className={`flex items-end justify-center h-[54px] px-3 ${className ?? ''}`}
    >
      <div className="flex flex-1 items-center justify-start pb-[3px] pl-[7px]">
        <div className="h-[21px] relative rounded-[24px] w-[54px]">
          <p className="-translate-x-1/2 absolute font-[system-ui] h-[20px] leading-[21px] left-[27px] text-[16px] text-black text-center top-px tracking-[-0.32px]">
            9:41
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center pb-[3px]">
        <StatusBarDynamicIsland />
      </div>

      <div className="flex flex-1 items-center justify-end pb-[3px] pr-[11px]">
        <div className="flex items-center gap-2 text-black">
          <Signal className="size-[15px]" strokeWidth={2} aria-hidden />
          <Wifi className="size-[15px]" strokeWidth={2} aria-hidden />
          <BatteryFull className="size-[17px]" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function StatusBarAndroid({ className }: StatusBarProps) {
  return (
    <div
      className={`flex h-[48px] items-center justify-between px-3 text-xs text-blackBg ${className ?? ''}`}
    >
      <span className="font-medium">9:41</span>
      <div className="flex items-center gap-1.5 text-blackBg">
        <Signal size={14} strokeWidth={1.8} />
        <Wifi size={14} strokeWidth={1.8} />
        <BatteryFull size={16} strokeWidth={1.8} />
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


