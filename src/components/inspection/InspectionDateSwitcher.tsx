import { useNavigate } from 'react-router-dom';
import type { InspectionRound } from '../../lib/inspectionArchive';
import { inspectionReportDetailPath, isValidResultId } from '../../lib/inspectionReportNav';

type InspectionDateSwitcherProps = {
  rounds: InspectionRound[];
  activeResultId: number;
  className?: string;
};

function formatDayLabel(iso: string): string {
  if (iso.length >= 10) {
    return iso.slice(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})/, '$2.$3');
  }
  return iso;
}

/** 상세 리포트 — 다른 검사일 선택 시 해당 resultId로 이동 */
export function InspectionDateSwitcher({
  rounds,
  activeResultId,
  className = '',
}: InspectionDateSwitcherProps) {
  const navigate = useNavigate();

  if (rounds.length <= 1) return null;

  return (
    <div className={className} role="navigation" aria-label="검사일 선택">
      <p className="mb-2 text-[11px] font-semibold tracking-wide text-white/70">다른 검사일</p>
      <div className="premium-scroll-x flex gap-2 pb-1">
        {rounds.map((round) => {
          const active = round.resultId === activeResultId;
          const dayLabel = formatDayLabel(round.inspectedAt);
          return (
            <button
              key={round.id}
              type="button"
              onClick={() => {
                if (active || !isValidResultId(round.resultId)) return;
                navigate(inspectionReportDetailPath(round.resultId), { replace: true });
              }}
              aria-pressed={active}
              aria-label={`${dayLabel} 검사${active ? ', 현재 보는 중' : ''}`}
              className={[
                'shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold tabular-nums transition active:scale-[0.97]',
                active
                  ? 'bg-white text-[#7B6EE8] shadow-md ring-1 ring-white/80'
                  : 'bg-white/15 text-white/90 ring-1 ring-white/25 hover:bg-white/22',
              ].join(' ')}
            >
              {dayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
