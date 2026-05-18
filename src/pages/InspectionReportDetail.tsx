import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Settings as SettingsIcon, Share2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InspectionReportFullView } from '../components/InspectionReportFullView';
import { BottomTabNav } from '../components/BottomTabNav';
import { fetchInspectionArchive } from '../lib/inspectionArchive';
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
          if (mounted) setRecord(hr);
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
          if (mounted) setRecord(hr);
          return;
        }

        const [rp, archive] = await Promise.all([
          fetchResultReport(resultId),
          fetchInspectionArchive(),
        ]);
        const meta = findRoundMetaForResultId(archive, resultId) ?? todayMeta(String(resultId));
        const hr = healthRecordFromResultReport(rp, meta);

        if (mounted) setRecord(hr);
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

  const shareReport = useCallback(async () => {
    if (!record) return;
    const title = '검사 리포트';
    const text = `${nickname}님의 종합 점수는 ${record.score}점 / 100점입니다.`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      }
    } catch {
      /* 사용자 취소 또는 미지원 */
    }
  }, [nickname, record]);

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
          <header className="flex shrink-0 items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white shadow-[0_8px_24px_rgba(60,40,120,0.2)] ring-1 ring-white/30 backdrop-blur-md transition active:scale-[0.98]"
              aria-label="이전 화면으로 이동"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>

            <h1 className="min-w-0 flex-1 text-center type-screen-title text-[18px] leading-[24px] drop-shadow-[0_1px_8px_rgba(60,40,100,0.25)]">
              검사 리포트
            </h1>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label="리포트 공유"
                onClick={() => void shareReport()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition active:scale-[0.98]"
              >
                <Share2 className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </button>
              <button
                type="button"
                aria-label="설정"
                onClick={() => navigate('/settings')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-blackBg shadow-[0_10px_28px_rgba(40,30,80,0.22)] ring-1 ring-white/60 backdrop-blur-md transition active:scale-[0.98]"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
            </div>
          </header>

          {record && !loading && !error ? (
            <p className="mt-2 text-center text-[12px] font-medium tabular-nums text-white/82">
              {record.date.length >= 10
                ? record.date.slice(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})/, '$1.$2.$3')
                : record.date}
            </p>
          ) : null}

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex h-40 items-center justify-center rounded-[20px] bg-white/[0.13] text-[13px] text-white/88 shadow-[0_12px_36px_rgba(45,30,90,0.18)] ring-1 ring-white/25 backdrop-blur-xl">
                리포트를 불러오는 중이에요...
              </div>
            ) : error ? (
              <div className="rounded-[20px] bg-white/[0.13] px-4 py-6 text-center text-[13px] leading-relaxed text-white/92 shadow-[0_12px_36px_rgba(45,30,90,0.18)] ring-1 ring-white/25 backdrop-blur-xl">
                {error}
              </div>
            ) : record ? (
              <InspectionReportFullView record={record} />
            ) : null}
          </div>
        </main>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default InspectionReportDetailPage;
