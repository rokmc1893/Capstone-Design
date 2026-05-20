import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InspectionReportFullView } from '../components/InspectionReportFullView';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import { StatusBar } from '../components/StatusBar';
import { GRADIENT_BG_STYLE, MOBILE_FRAME, MOBILE_SHELL } from '../components/ui/glassStyles';
import { typeBodySm, typeScreenTitle } from '../lib/typography';
import {
  fetchInspectionArchive,
  flattenArchiveRounds,
  type InspectionRound,
} from '../lib/inspectionArchive';
import { findRoundMetaForResultId, healthRecordFromResultReport } from '../lib/healthReportApi';
import { fetchLatestResultReport, fetchResultReport, parseResultId } from '../lib/resultReport';
import type { HealthRecord } from '../types/healthReport';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

function todayMeta(id: string): { year: number; month: number; week: number; date: string; id: string } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    week: 1,
    date: now.toISOString().slice(0, 10),
    id,
  };
}

const InspectionReportDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resultIdParam = searchParams.get('resultId');
  const roundId = searchParams.get('roundId');
  const source = searchParams.get('source');

  const nickname = useUserProfileStore((state) => state.nickname || state.name);

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [inspectionRounds, setInspectionRounds] = useState<InspectionRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backPath = useMemo(() => {
    if (resultIdParam || roundId) return '/inspection-reports/archive';
    return '/home';
  }, [resultIdParam, roundId]);

  useEffect(() => {
    let mounted = true;

    const resolveLatestHealthRecord = async () => {
      const rp = await fetchLatestResultReport(useSimulatorStore.getState(), nickname);
      return healthRecordFromResultReport(rp, todayMeta(String(rp.resultId)));
    };

    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);

        if (source === 'latest') {
          const hr = await resolveLatestHealthRecord();
          if (!mounted) return;
          setRecord(hr);
          const archive = await fetchInspectionArchive();
          if (mounted) setInspectionRounds(flattenArchiveRounds(archive));
          return;
        }

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

        if (resultId === null) {
          const hr = await resolveLatestHealthRecord();
          if (!mounted) return;
          setRecord(hr);
          const archive = await fetchInspectionArchive();
          if (mounted) setInspectionRounds(flattenArchiveRounds(archive));
          return;
        }

        const [rp, archive] = await Promise.all([
          fetchResultReport(resultId),
          fetchInspectionArchive(),
        ]);
        const meta = findRoundMetaForResultId(archive, resultId) ?? todayMeta(String(resultId));
        const hr = healthRecordFromResultReport(rp, meta);

        if (!mounted) return;
        setRecord(hr);
        setInspectionRounds(flattenArchiveRounds(archive));
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
    <div className={MOBILE_SHELL}>
      <div className={MOBILE_FRAME} style={GRADIENT_BG_STYLE}>
        <MobileGlassBackdrop />

        <header className="relative z-20 shrink-0 px-6 pb-3 max-sm:pb-2">
          <StatusBar />
          <div className="mt-2 flex items-center justify-between gap-2 max-sm:mt-1.5">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition active:opacity-70"
            aria-label="이전 화면으로 이동"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>

          <h1 className={`min-w-0 flex-1 text-center ${typeScreenTitle} text-[17px] text-white`}>
            검사 리포트
          </h1>

          <button
            type="button"
            aria-label="검사 기록"
            onClick={() => navigate('/inspection-reports/archive')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#7B6EE8] shadow-md active:scale-[0.97]"
          >
            <Activity className="h-5 w-5" strokeWidth={2} />
          </button>
          </div>
        </header>

        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div
              className={`mx-6 flex h-44 items-center justify-center rounded-[24px] bg-white/15 ${typeBodySm} text-white/88`}
            >
              리포트를 불러오는 중이에요...
            </div>
          ) : error ? (
            <div
              className={`mx-6 rounded-[24px] bg-white/15 px-5 py-8 text-center ${typeBodySm} leading-relaxed text-white/92`}
            >
              {error}
            </div>
          ) : record ? (
            <InspectionReportFullView record={record} inspectionRounds={inspectionRounds} />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default InspectionReportDetailPage;
