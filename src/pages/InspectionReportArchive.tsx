import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomTabNav } from '../components/BottomTabNav';
import {
  buildMonthCalendarGrid,
  distinctInspectionDatesInMonth,
  fetchInspectionArchive,
  getDefaultSelection,
  getMonthEntry,
  getYearEntry,
  pickMonthWhenYearChanges,
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
  /** 같은 달에 여러 날 검사 시, 해당 날만 필터 (YYYY-MM-DD) */
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  const monthEntry = useMemo(
    () => getMonthEntry(yearEntry, selectedMonth),
    [selectedMonth, yearEntry],
  );

  const rounds = monthEntry?.rounds ?? [];

  const inspectionDates = useMemo(() => distinctInspectionDatesInMonth(rounds), [rounds]);

  const inspectionDateSet = useMemo(() => new Set(inspectionDates), [inspectionDates]);

  const calendarCells = useMemo(
    () => buildMonthCalendarGrid(selectedYear, selectedMonth, inspectionDateSet),
    [selectedYear, selectedMonth, inspectionDateSet],
  );

  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const filteredRounds = useMemo(() => {
    if (!selectedDay) return rounds;
    return rounds.filter((r) => r.inspectedAt.slice(0, 10) === selectedDay);
  }, [rounds, selectedDay]);

  const monthHasInspection = useMemo(() => {
    return (month: number) => {
      const me = getMonthEntry(yearEntry, month);
      return (me?.rounds.length ?? 0) > 0;
    };
  }, [yearEntry]);

  const calendarMonths = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const handleYearChange = (year: number) => {
    if (!archive) return;
    setSelectedYear(year);
    setSelectedDay(null);
    const yearEntry = getYearEntry(archive, year);
    setSelectedMonth((prev) =>
      pickMonthWhenYearChanges(yearEntry, prev, new Date().getMonth() + 1),
    );
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setSelectedDay(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{
          background:
            'linear-gradient(180deg, #9388FA 0%, #A894F0 38%, #D4A8D8 72%, #E0A1CD 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-white/[0.18] blur-[48px]" />
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/22 blur-[36px]" />
          <div className="absolute top-[200px] right-[-80px] h-[280px] w-[280px] rounded-full bg-[#E0A1CD]/40 blur-[44px]" />
          <div className="absolute bottom-[-60px] left-[-50px] h-[220px] w-[220px] rounded-full bg-[#9388FA]/35 blur-[40px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-white/[0.06]" />
          <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-[2px]" />
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pt-12 pb-28">
          <header className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white shadow-[0_8px_24px_rgba(60,40,120,0.2)] ring-1 ring-white/30 backdrop-blur-md transition active:scale-[0.98]"
              aria-label="홈으로 이동"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>

            <h1 className="min-w-0 flex-1 text-center type-screen-title text-[18px] leading-[24px] drop-shadow-[0_1px_8px_rgba(60,40,100,0.25)]">
              검사 상세 리포트
            </h1>

            <button
              type="button"
              aria-label="설정"
              onClick={() => navigate('/settings')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-blackBg shadow-[0_10px_28px_rgba(40,30,80,0.22)] ring-1 ring-white/60 backdrop-blur-md transition active:scale-[0.98]"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </header>

          <section className="mt-7 shrink-0" aria-label="연도 선택">
            <p className="text-[12px] font-semibold tracking-wide text-white/88">연도</p>
            <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 pl-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sortedYears.length > 0 ? (
                sortedYears.map((entry) => {
                  const active = entry.year === selectedYear;
                  return (
                    <button
                      key={entry.year}
                      type="button"
                      onClick={() => handleYearChange(entry.year)}
                      className={[
                        'shrink-0 rounded-full px-[18px] py-2.5 text-[13px] font-semibold transition-all duration-200',
                        active
                          ? 'bg-white text-[#7B6EE8] shadow-[0_12px_32px_rgba(50,35,100,0.22)] ring-1 ring-white/80'
                          : 'bg-white/[0.16] text-white/82 ring-1 ring-white/[0.22] backdrop-blur-md hover:bg-white/22 active:scale-[0.98]',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      {entry.year}년
                    </button>
                  );
                })
              ) : (
                <span className="rounded-full bg-white/[0.16] px-[18px] py-2.5 text-[13px] font-semibold text-white/82 ring-1 ring-white/[0.22] backdrop-blur-md">
                  {selectedYear}년
                </span>
              )}
            </div>
          </section>

          <section className="mt-5 shrink-0" aria-label="월 선택">
            <p className="text-[12px] font-semibold tracking-wide text-white/88">월</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {calendarMonths.map((month) => {
                const hasData = monthHasInspection(month);
                const active = month === selectedMonth;
                return (
                  <button
                    key={month}
                    type="button"
                    disabled={!hasData}
                    onClick={() => hasData && handleMonthChange(month)}
                    className={[
                      'min-w-[52px] rounded-full px-3 py-2.5 text-[13px] font-semibold transition-all duration-200',
                      !hasData
                        ? 'cursor-not-allowed bg-white/[0.06] text-white/35 ring-1 ring-white/10'
                        : active
                          ? 'bg-[#9388FA] text-white shadow-[0_10px_28px_rgba(120,90,200,0.45)] ring-1 ring-white/35'
                          : 'bg-white/[0.14] text-white/78 ring-1 ring-white/[0.18] backdrop-blur-md hover:bg-white/20 active:scale-[0.98]',
                    ].join(' ')}
                    aria-pressed={active}
                    aria-disabled={!hasData}
                  >
                    {month}월
                  </button>
                );
              })}
            </div>
          </section>

          {rounds.length > 0 ? (
            <section className="mt-4 shrink-0" aria-label="달력에서 검사일 선택">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-semibold tracking-wide text-white/88">검사일</p>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                    selectedDay === null
                      ? 'bg-white text-[#7B6EE8] shadow-md ring-1 ring-white/80'
                      : 'bg-white/[0.12] text-white/75 ring-1 ring-white/[0.16] backdrop-blur-md active:scale-[0.98]'
                  }`}
                >
                  전체
                </button>
              </div>
              <div
                className="mt-2 rounded-[16px] bg-white/[0.1] p-2.5 ring-1 ring-white/[0.14] backdrop-blur-md"
                role="grid"
                aria-label={`${selectedYear}년 ${selectedMonth}월`}
              >
                <div className="grid grid-cols-7 gap-1 text-center">
                  {weekdayLabels.map((w) => (
                    <div
                      key={w}
                      className="pb-1 text-[10px] font-semibold tabular-nums text-white/55"
                      role="columnheader"
                    >
                      {w}
                    </div>
                  ))}
                  {calendarCells.map((cell) => {
                    if (cell.day === null || cell.iso === null) {
                      return <div key={cell.key} className="aspect-square min-h-[34px]" aria-hidden />;
                    }
                    const has = cell.hasInspection;
                    const selected = has && selectedDay === cell.iso;
                    return (
                      <button
                        key={cell.key}
                        type="button"
                        disabled={!has}
                        onClick={() => has && setSelectedDay(cell.iso)}
                        aria-pressed={selected}
                        aria-label={`${cell.day}일${has ? ', 검사 있음' : ''}`}
                        className={[
                          'relative flex aspect-square min-h-[34px] items-center justify-center rounded-xl text-[12px] font-semibold tabular-nums transition',
                          !has && 'cursor-default text-white/28',
                          has &&
                            !selected &&
                            'text-white/88 ring-1 ring-white/[0.12] hover:bg-white/10 active:scale-[0.96]',
                          has &&
                            selected &&
                            'bg-[#9388FA] text-white shadow-md ring-1 ring-white/35',
                          cell.isToday && !selected && has && 'ring-2 ring-amber-200/70',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {cell.day}
                        {has ? (
                          <span
                            className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                              selected ? 'bg-white' : 'bg-emerald-300/90'
                            }`}
                            aria-hidden
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <section
            className="mt-5 min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="검사 기록 목록"
          >
            <p className="mb-3 text-[12px] font-semibold tracking-wide text-white/88">검사 기록</p>
            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-[20px] bg-white/[0.13] text-[13px] text-white/88 shadow-[0_12px_36px_rgba(45,30,90,0.18)] ring-1 ring-white/25 backdrop-blur-xl">
                기록을 불러오는 중이에요...
              </div>
            ) : error ? (
              <div className="rounded-[20px] bg-white/[0.13] px-4 py-6 text-center text-[13px] leading-relaxed text-white/92 shadow-[0_12px_36px_rgba(45,30,90,0.18)] ring-1 ring-white/25 backdrop-blur-xl">
                {error}
              </div>
            ) : filteredRounds.length === 0 ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-[20px] bg-white/[0.11] px-5 py-10 text-center shadow-[0_14px_40px_rgba(45,30,90,0.16)] ring-1 ring-white/20 backdrop-blur-xl">
                <div className="h-px w-12 rounded-full bg-white/35" aria-hidden />
                <p className="text-[14px] font-medium leading-relaxed text-white/88">
                  {rounds.length > 0 && selectedDay
                    ? '선택한 날짜에 검사 기록이 없어요'
                    : '해당 기간에 검사 기록이 없습니다'}
                </p>
              </div>
            ) : (
              <ul className="space-y-3 pb-2">
                {filteredRounds.map((round) => (
                  <li key={round.id}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/inspection-reports/detail?resultId=${round.resultId}`)
                      }
                      className="group flex w-full items-center justify-between gap-3 rounded-[20px] bg-white/[0.14] px-4 py-4 text-left shadow-[0_14px_36px_rgba(45,32,95,0.22),0_0_0_1px_rgba(255,255,255,0.12)_inset] ring-1 ring-white/25 backdrop-blur-xl transition active:scale-[0.99]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-keep text-[15px] font-semibold leading-[22px] text-white">
                          {round.label}
                        </p>
                        <p className="mt-1 text-[12px] text-white/72">
                          {formatInspectedAt(round.inspectedAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/[0.2] px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                            {round.riskScore}점
                          </span>
                          <span className="text-[11px] font-medium text-white/78">
                            {round.statusLabel}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className="h-5 w-5 shrink-0 text-white/65 transition group-active:translate-x-0.5"
                        strokeWidth={2}
                      />
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
