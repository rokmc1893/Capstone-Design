import { Activity, ChevronRight } from 'lucide-react';
import { formatArchiveDateShort } from '../../lib/reportFormat';

export type InspectionRoundCardItem = {
  id: string;
  resultId: number;
  label: string;
  inspectedAt: string;
  riskScore: number;
  statusLabel: string;
};

type InspectionArchiveRoundCardProps = {
  round: InspectionRoundCardItem;
  onOpen: (resultId: number) => void;
};

export function InspectionArchiveRoundCard({ round, onOpen }: InspectionArchiveRoundCardProps) {
  const dateLabel = formatArchiveDateShort(round.inspectedAt);

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(round.resultId)}
        className="group flex w-full items-center gap-3 rounded-[20px] bg-white px-4 py-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition active:scale-[0.99]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EDE9FE]">
          <Activity className="h-6 w-6 text-[#7C6EE8]" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-[#1a1a1f]">{round.label}</p>
          <p className="mt-1 text-[13px] tabular-nums text-[#8E8E93]">{dateLabel}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#7C6EE8]">
          <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
      </button>
    </li>
  );
}
