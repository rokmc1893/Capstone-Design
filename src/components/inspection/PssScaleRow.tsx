import type { PssScore } from '../../store/useSimulatorStore';

export const PSS_SCALE_ITEMS: Array<{ value: PssScore; label: string }> = [
  { value: 0, label: '전혀 없었다' },
  { value: 1, label: '거의 없었다' },
  { value: 2, label: '때때로 있었다' },
  { value: 3, label: '자주 있었다' },
  { value: 4, label: '매우 자주 있었다' },
];

export function PssScaleRow({
  value,
  onChange,
}: {
  value: PssScore | null;
  onChange: (v: PssScore) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {PSS_SCALE_ITEMS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`rounded-[10px] border py-2 text-[14px] font-semibold transition ${
              value === item.value
                ? 'border-[#9388FA] bg-[#9388FA] text-white'
                : 'border-[#D6D6DE] bg-white text-[#3a3a42] active:bg-[#F7F7FB]'
            }`}
          >
            {item.value}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 text-center">
        {PSS_SCALE_ITEMS.map((item) => (
          <span key={item.value} className="text-[10px] leading-tight text-[#6B6B76]">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
