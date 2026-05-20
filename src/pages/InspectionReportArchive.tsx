import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InspectionArchiveRoundCard } from '../components/inspection/InspectionArchiveRoundCard';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import { StatusBar } from '../components/StatusBar';
import { GRADIENT_BG_STYLE, MOBILE_FRAME, MOBILE_SHELL } from '../components/ui/glassStyles';
import {
  fetchInspectionArchive,
  getDefaultSelection,
  getMonthEntry,
  getYearEntry,
  pickMonthWhenYearChanges,
  roundsOnLocalDate,
  sortArchiveYears,
  type InspectionArchiveResponse,
} from '../lib/inspectionArchive';
import { inspectionReportDetailPath, isValidResultId } from '../lib/inspectionReportNav';
import { typeScreenTitle } from '../lib/typography';

const InspectionReportArchive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoOpenedDayRef = useRef<string | null>(null);
  const [archive, setArchive] = useState<InspectionArchiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);

  const openDetail = useCallback(
    (resultId: number) => {
      if (!isValidResultId(resultId)) return;
      navigate(inspectionReportDetailPath(resultId));
    },
    [navigate],
  );

  useEffect(() => {
    let mounted = true;
    void (async () => {
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
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!archive || loading) return;
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    const year = yearParam ? parseInt(yearParam, 10) : NaN;
    const month = monthParam ? parseInt(monthParam, 10) : NaN;
    if (Number.isFinite(year) && year > 0) {
      setSelectedYear(year);
      if (Number.isFinite(month) && month >= 1 && month <= 12) {
        setSelectedMonth(month);
      }
    }
  }, [archive, loading, searchParams]);

  useEffect(() => {
    if (!archive || loading) return;
    const dayParam = searchParams.get('day');
    if (!dayParam || !/^\d{4}-\d{2}-\d{2}$/.test(dayParam)) return;
    if (autoOpenedDayRef.current === dayParam) return;

    const year = Number.parseInt(searchParams.get('year') ?? dayParam.slice(0, 4), 10);
    const month = Number.parseInt(searchParams.get('month') ?? dayParam.slice(5, 7), 10);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return;

    const ye = getYearEntry(archive, year);
    const me = getMonthEntry(ye, month);
    const dayRounds = roundsOnLocalDate(me?.rounds ?? [], dayParam);
    const latest = dayRounds.find((r) => isValidResultId(r.resultId));
    if (!latest) return;

    autoOpenedDayRef.current = dayParam;
    openDetail(latest.resultId);
  }, [archive, loading, openDetail, searchParams]);

  const sortedYears = useMemo(
    () => (archive ? sortArchiveYears(archive.years) : []),
    [archive],
  );

  const yearEntry = useMemo(
    () => (archive ? getYearEntry(archive, selectedYear) : undefined),
    [archive, selectedYear],
  );

  const rounds = useMemo(() => {
    const me = getMonthEntry(yearEntry, selectedMonth);
    return me?.rounds ?? [];
  }, [selectedMonth, yearEntry]);

  const monthHasInspection = useCallback(
    (month: number) => (getMonthEntry(yearEntry, month)?.rounds.length ?? 0) > 0,
    [yearEntry],
  );

  const handleYearChange = (year: number) => {
    if (!archive) return;
    setSelectedYear(year);
    const ye = getYearEntry(archive, year);
    setSelectedMonth((prev) =>
      pickMonthWhenYearChanges(ye, prev, new Date().getMonth() + 1),
    );
  };

  const yearOptions =
    sortedYears.length > 0 ? sortedYears : [{ year: selectedYear, months: [] }];

  return (
    <div className={MOBILE_SHELL}>
      <div className={MOBILE_FRAME} style={GRADIENT_BG_STYLE}>
        <MobileGlassBackdrop />

        <header className="relative z-10 shrink-0 px-6 pb-3 max-sm:pb-2">
          <StatusBar />
          <div className="mt-2 flex items-center justify-between gap-3 max-sm:mt-1.5">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white active:opacity-70"
            aria-label="홈으로 이동"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>

          <h1 className={`min-w-0 flex-1 text-center ${typeScreenTitle} text-[17px] text-white`}>
            검사 상세 리포트
          </h1>

          <button
            type="button"
            aria-label="설정"
            onClick={() => navigate('/settings')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#1a1a1f] shadow-md active:scale-[0.97]"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
          </div>
        </header>

        <div className="relative z-10 min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section>
          <p className="text-[13px] font-semibold text-white/88">연도 선택</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {yearOptions.map((entry) => {
              const active = entry.year === selectedYear;
              return (
                <button
                  key={entry.year}
                  type="button"
                  onClick={() => handleYearChange(entry.year)}
                  className={[
                    'shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition',
                    active
                      ? 'bg-white text-[#7B6EE8] shadow-md'
                      : 'bg-white/20 text-white/85 ring-1 ring-white/25',
                  ].join(' ')}
                  aria-pressed={active}
                >
                  {entry.year}년
                </button>
              );
            })}
          </div>
          </section>

          <section>
          <p className="text-[13px] font-semibold text-white/88">월 선택</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const hasData = monthHasInspection(month);
              const active = month === selectedMonth;
              return (
                <button
                  key={month}
                  type="button"
                  disabled={!hasData}
                  onClick={() => hasData && setSelectedMonth(month)}
                  className={[
                    'min-w-[52px] rounded-full px-3 py-2 text-[13px] font-semibold transition',
                    !hasData
                      ? 'cursor-not-allowed bg-white/10 text-white/35'
                      : active
                        ? 'bg-white text-[#7B6EE8] shadow-md'
                        : 'bg-white/20 text-white/80 ring-1 ring-white/25',
                  ].join(' ')}
                  aria-pressed={active}
                >
                  {month}월
                </button>
              );
            })}
          </div>
          </section>

          <section>
          <p className="text-[13px] font-semibold text-white/88">검사 기록</p>

          {loading ? (
            <div className="mt-2.5 flex min-h-[120px] items-center justify-center rounded-[20px] bg-white/15 text-[13px] text-white/88">
              기록을 불러오는 중이에요...
            </div>
          ) : error ? (
            <div className="mt-2.5 rounded-[20px] bg-white/15 px-4 py-6 text-center text-[13px] leading-relaxed text-white/92">
              {error}
            </div>
          ) : rounds.length === 0 ? (
            <div className="mt-2.5 flex min-h-[100px] items-center justify-center rounded-[20px] bg-white/10 px-5 text-center text-[14px] text-white/80">
              해당 기간에 검사 기록이 없습니다
            </div>
          ) : (
            <ul className="mt-2.5 space-y-2.5">
              {rounds.map((round) => (
                <InspectionArchiveRoundCard key={round.id} round={round} onOpen={openDetail} />
              ))}
            </ul>
          )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default InspectionReportArchive;
