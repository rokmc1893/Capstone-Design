type TapCounselProps = {
  className?: string;
  children?: React.ReactNode;
};

// Figma tap_counsel (하단 탭 컨테이너) 스타일 구현
export function TapCounsel({ className, children }: TapCounselProps) {
  return (
    <div
      className={`rounded-[50px] backdrop-blur-[2px] bg-[rgba(255,255,255,0.8)] border border-[#e7e7e7] border-solid ${
        className ?? ''
      }`}
      data-name="tap_counsel"
    >
      {children}
    </div>
  );
}

