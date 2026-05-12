import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResultReportDetailView } from '../components/ResultReportDetailView';
import { BottomTabNav } from '../components/BottomTabNav';
import { fetchInspectionArchive } from '../lib/inspectionArchive';
import {
  fetchLatestResultReport,
  fetchResultReport,
  getRiskLevelLabel,
  parseResultId,
} from '../lib/resultReport';
import type { ResultReport } from '../types/resultReport';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

const InspectionReportDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultIdParam = searchParams.get('resultId');
  const roundId = searchParams.get('roundId');
  const source = searchParams.get('source');

  const nickname = useUserProfileStore((state) => state.nickname || state.name);

  const [report, setReport] = useState<ResultReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backPath = useMemo(() => {
    if (resultIdParam || roundId) return '/inspection-reports/archive';
    return '/home';
  }, [resultIdParam, roundId]);

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);

        let resultId = parseResultId(resultIdParam);

        if (resultId === null && roundId) {
          const archive = await fetchInspectionArchive();
          for (const yearEntry of archive.years) {
            for (const monthEntry of yearEntry.months) {
              const round = monthEntry.rounds.find((item) => item.id === roundId);
              if (round) {
                resultId = round.resultId;
                break;
              }
            }
            if (resultId !== null) break;
          }
        }

        const data =
          source === 'latest'
            ? await fetchLatestResultReport(useSimulatorStore.getState(), nickname)
            : resultId !== null
              ? await fetchResultReport(resultId)
              : await fetchLatestResultReport(useSimulatorStore.getState(), nickname);

        if (!mounted) return;
        setReport(data);
      } catch {
        if (!mounted) return;
        setError('상세 리포트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadReport();

    return () => {
      mounted = false;
    };
  }, [nickname, resultIdParam, roundId, source]);

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
              onClick={() => navigate(backPath)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md active:scale-[0.98]"
              aria-label="이전 화면으로 이동"
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

          {report && (
            <div className="mt-4 shrink-0 rounded-full bg-white/18 px-3 py-1.5 text-center text-[11px] font-medium text-white/90 ring-1 ring-white/30">
              {report.nickname} · {report.score}점 · {getRiskLevelLabel(report.riskLevel)}
            </div>
          )}

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-[22px] bg-white/12 text-[13px] text-white/85 ring-1 ring-white/25 backdrop-blur-xl">
                리포트를 불러오는 중이에요...
              </div>
            ) : error ? (
              <div className="rounded-[22px] bg-white/12 px-4 py-6 text-center text-[13px] leading-relaxed text-white/90 ring-1 ring-white/25 backdrop-blur-xl">
                {error}
              </div>
            ) : report ? (
              <ResultReportDetailView report={report} />
            ) : null}
          </div>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default InspectionReportDetailPage;
