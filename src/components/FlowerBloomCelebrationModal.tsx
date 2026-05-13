import type { MissionFlower } from '../data/missionFlowers';

type FlowerBloomCelebrationModalProps = {
  flower: MissionFlower;
  open: boolean;
  onClose: () => void;
};

export function FlowerBloomCelebrationModal({ flower, open, onClose }: FlowerBloomCelebrationModalProps) {
  if (!open) return null;

  const [m1, m2] = flower.flowerMeaningsPopup;
  const displayName = `${flower.nameKo} (${flower.nameEn})`;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flower-bloom-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-[1] w-full max-w-[320px] rounded-[28px] bg-white px-6 py-7 text-center shadow-[0_24px_80px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
        <div className="mb-4 flex justify-center text-[52px] leading-none" aria-hidden>
          {flower.emoji}
        </div>
        <h2 id="flower-bloom-title" className="sr-only">
          꽃 개화 축하
        </h2>
        <p className="text-[15px] font-semibold leading-relaxed tracking-[-0.2px] text-slate-800">
          이 꽃의 이름은 <span className="text-pink-600">{displayName}</span> 입니다,
          <br />
          꽃말은 <span className="text-violet-600">{m1}</span>, <span className="text-violet-600">{m2}</span>{' '}
          입니다.
          <br />
          <span className="mt-3 block text-[16px] font-bold text-slate-900">열심히 하셨군요!</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 py-3 text-[14px] font-bold text-white shadow-lg shadow-pink-500/25 active:scale-[0.98]"
        >
          확인
        </button>
      </div>
    </div>
  );
}
