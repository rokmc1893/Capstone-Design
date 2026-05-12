import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomTabNav } from '../components/BottomTabNav';
import {
  fetchInspectionArchive,
  getActiveMonths,
  getDefaultSelection,
  getMonthEntry,
  getYearEntry,
  sortArchiveYears,
  type InspectionArchiveResponse,
} from '../lib/inspectionArchive';

function formatInspectedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const InspectionReportArchive = () => {
  const navigate = useNavigate();
  const [archive, setArchive] = useState<InspectionArchiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);

  useEffect(() => {
    let mounted = true;

    const loadArchive = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInspectionArchive();
        if (!mounted) return;

        setArchive(data);
        const defaults = getDefaultSelection(data);
        setSelectedYear(defaults.year);
        setSelectedMonth(defaults.month);
      } catch {
        if (!mounted) return;
        setError('검사 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadArchive();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedYears = useMemo(
    () => (archive ? sortArchiveYears(archive.years) : []),
    [archive],
  );

  const yearEntry = useMemo(
    () => (archive ? getYearEntry(archive, selectedYear) : undefined),
    [archive, selectedYear],
  );

  const activeMonths = useMemo(() => getActiveMonths(yearEntry), [yearEntry]);

  const monthEntry = useMemo(
    () => getMonthEntry(yearEntry, selectedMonth),
    [selectedMonth, yearEntry],
  );

  const rounds = monthEntry?.rounds ?? [];

  const handleYearChange = (year: number) => {
    if (!archive) return;

    setSelectedYear(year);
    const nextYearEntry = getYearEntry(archive, year);
    const nextActiveMonths = getActiveMonths(nextYearEntry);
    const now = new Date();
    const nextMonth = nextActiveMonths.includes(now.getMonth() + 1)
      ? now.getMonth() + 1
      : (nextActiveMonths[0] ?? selectedMonth);

    setSelectedMonth(nextMonth);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pt-12 pb-28">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md active:scale-[0.98]"
              aria-label="홈으로 이동"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>

            <h1 className="min-w-0 flex-1 text-center text-[18px] font-bold leading-[24px] tracking-[-0.2px] text-white">
              검사 상세 리포트
            </h1>

            <button
              type="button"
              aria-label="설정"
              onClick={() => navigate('/settings')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/50 backdrop-blur-md active:scale-[0.98]"
            >
              <SettingsIcon className="h-5 w-5 text-blackBg" />
            </button>
          </div>

          <section className="mt-7 shrink-0">
            <p className="text-[12px] font-semibold text-white/85">연도 선택</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sortedYears.length > 0 ? (
                sortedYears.map((entry) => {
                  const active = entry.year === selectedYear;
                  return (
                    <button
                      key={entry.year}
                      type="button"
                      onClick={() => handleYearChange(entry.year)}
                      className={[
                        'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition',
                        active
                          ? 'bg-white text-[#9388FA] shadow-[0_10px_24px_rgba(16,24,40,0.14)]'
                          : 'bg-white/20 text-white/85 ring-1 ring-white/25 backdrop-blur-md active:scale-[0.98]',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      {entry.year}년
                    </button>
                  );
                })
              ) : (
                <span className="rounded-full bg-white/20 px-4 py-2 text-[13px] font-semibold text-white/85 ring-1 ring-white/25">
                  {selectedYear}년
                </span>
              )}
            </div>
          </section>

          <section className="mt-5 shrink-0">
            <p className="text-[12px] font-semibold text-white/85">월 선택</p>
            {activeMonths.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeMonths.map((month) => {
                  const active = month === selectedMonth;
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthChange(month)}
                      className={[
                        'rounded-full px-4 py-2 text-[13px] font-semibold transition',
                        active
                          ? 'bg-[#9388FA] text-white shadow-[0_10px_24px_rgba(147,136,250,0.35)]'
                          : 'bg-white/20 text-white/85 ring-1 ring-white/25 backdrop-blur-md active:scale-[0.98]',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      {month}월
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-[12px] text-white/70">표시할 검사 월이 없습니다.</p>
            )}
          </section>

          <section className="mt-6 min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-[22px] bg-white/12 text-[13px] text-white/85 ring-1 ring-white/25 backdrop-blur-xl">
                기록을 불러오는 중이에요...
              </div>
            ) : error ? (
              <div className="rounded-[22px] bg-white/12 px-4 py-6 text-center text-[13px] leading-relaxed text-white/90 ring-1 ring-white/25 backdrop-blur-xl">
                {error}
              </div>
            ) : rounds.length === 0 ? (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-[22px] bg-white/12 px-4 py-8 text-center text-[14px] leading-relaxed text-white/85 ring-1 ring-white/25 backdrop-blur-xl">
                해당 기간에 검사 기록이 없습니다
              </div>
            ) : (
              <ul className="space-y-3 pb-2">
                {rounds.map((round) => (
                  <li key={round.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/inspection-reports/detail?resultId=${round.resultId}`)
                      }
                      className="group flex w-full items-center justify-between gap-3 rounded-[22px] bg-white/12 px-4 py-4 text-left shadow-[0px_18px_40px_rgba(16,24,40,0.18)] ring-1 ring-white/25 backdrop-blur-xl active:scale-[0.99]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-keep text-[15px] font-semibold leading-[22px] text-white">
                          {round.label}
                        </p>
                        <p className="mt-1 text-[12px] text-white/75">
                          {formatInspectedAt(round.inspectedAt)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                            {round.riskScore}점
                          </span>
                          <span className="text-[11px] font-medium text-white/80">
                            {round.statusLabel}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-white/70 transition group-active:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default InspectionReportArchive;
