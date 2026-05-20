import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { PremiumScrollArea } from '../components/ui/PremiumScrollArea';
import { StatusBar } from '../components/StatusBar';
import { BottomTabNav } from '../components/BottomTabNav';
import { getMissionFlower, getMissionFlowerStageImageSrc } from '../data/missionFlowers';
import { fetchFlowerCollections } from '../lib/homeMissionsApi';
import {
  mapFlowerCollectionsToBloomRecords,
  mergeBloomRecordsUnique,
} from '../lib/flowerCollectionsMapper';
import { ApiError } from '../lib/api';
import {
  useBloomMissionsStore,
  type BloomRecordEntry,
} from '../store/useBloomMissionsStore';
import { useAuthStore } from '../store/useAuthStore';

function formatBloomCompleted(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function BloomGrid({ records }: { records: BloomRecordEntry[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 pt-2">
      {records.map((entry, idx) => {
        const flower = getMissionFlower(entry.flowerId);
        const bloomThumb = getMissionFlowerStageImageSrc(flower, 5);
        return (
          <div
            key={`${entry.flowerId}-${entry.completedAt}-${idx}`}
            className="flex flex-col items-center justify-center rounded-[20px] bg-white/15 p-3 shadow-[0_10px_32px_rgba(15,23,42,0.4)] ring-1 ring-white/30 backdrop-blur-md"
          >
            <div className="relative mb-2 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
              <div className="absolute inset-0 rounded-2xl bg-amber-200/15 blur-md" aria-hidden />
              {bloomThumb ? (
                <img
                  src={bloomThumb}
                  alt={`${flower.nameKo} 개화`}
                  className="relative z-[1] h-full w-full object-contain p-1"
                />
              ) : (
                <span className="relative z-[1] text-[40px] leading-none" aria-hidden>
                  {flower.emoji}
                </span>
              )}
            </div>
            <p className="text-center text-[11px] font-semibold leading-tight text-white">
              <span className="mr-0.5" aria-hidden>{flower.emoji}</span>
              {flower.nameKo}
            </p>
            {entry.completedAt ? (
              <p className="mt-1 text-center text-[9px] font-medium tabular-nums text-white/65">
                {formatBloomCompleted(entry.completedAt)}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const MissionsArchive = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/missions');
  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);
  const accessToken = useAuthStore((s) => s.accessToken);
  const localBloomRecords = useBloomMissionsStore((s) => s.bloomRecords);

  const [records, setRecords] = useState<BloomRecordEntry[]>([]);
  const [loading, setLoading] = useState(hasApiBase && Boolean(accessToken));
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'server' | 'local' | 'merged'>('local');

  const loadCollections = useCallback(async () => {
    if (!hasApiBase || !accessToken) {
      setRecords(localBloomRecords);
      setSource('local');
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dtos = await fetchFlowerCollections();
      setRecords(mapFlowerCollectionsToBloomRecords(dtos));
      setSource('server');
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : '꽃 도감을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
      setError(msg);
      const fallback = mergeBloomRecordsUnique([], localBloomRecords);
      setRecords(fallback);
      setSource(fallback.length > 0 ? 'merged' : 'local');
    } finally {
      setLoading(false);
    }
  }, [accessToken, hasApiBase, localBloomRecords]);

  useEffect(() => {
    void loadCollections();
  }, [loadCollections]);

  const emptyHint = useMemo(() => {
    if (source === 'server') {
      return '아직 꽃이 자라나지 않았어요. 미션을 완료해서 꽃을 키워 주세요!';
    }
    return '아직 꽃이 자라나지 않았어요. 미션을 완료해서 꽃을 키워 주세요!';
  }, [source]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div
        className="relative flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col min-h-0 overflow-hidden rounded-[28px] shadow-xl"
        style={{
          background: 'linear-gradient(to bottom, #A78BFA 0%, #F472B6 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#F472B6]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
        </header>

        <PremiumScrollArea showTopChrome className="relative z-10 flex flex-col px-5 pb-28 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:scale-[0.97]"
              aria-label="미션 화면으로 이동"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="type-screen-title">보관함</h1>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate('/inspection-reports/archive')}
              className="w-full rounded-[14px] bg-white/15 px-4 py-3 text-left text-[13px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition active:scale-[0.99]"
            >
              검사 결과 보관함으로 이동
              <span className="mt-0.5 block text-[11px] font-medium text-white/70">
                과거 검사일·리포트를 확인할 수 있어요
              </span>
            </button>
          </div>

          <section className="mt-6 flex-1">
            {loading ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-white/90">
                <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
                <p className="text-[14px] font-medium">꽃 도감을 불러오는 중…</p>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <div className="rounded-[16px] bg-white/95 px-4 py-3 text-center text-[13px] leading-relaxed text-[#3a3a42] ring-1 ring-white/70">
                  {error}
                  {records.length > 0 ? (
                    <p className="mt-2 text-[11px] text-[#6B6B76]">이 기기에 저장된 꽃 기록을 표시하고 있어요.</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void loadCollections()}
                  className="mx-auto block rounded-[12px] bg-white/90 px-5 py-2.5 text-[14px] font-semibold text-[#7c3aed]"
                >
                  다시 시도
                </button>
                {records.length > 0 ? <BloomGrid records={records} /> : null}
              </div>
            ) : records.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-white/80">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10">
                  <div className="h-9 w-9 rounded-full bg-pink-200/60" />
                </div>
                <p className="text-[14px] font-medium">{emptyHint}</p>
              </div>
            ) : (
              <BloomGrid records={records} />
            )}
          </section>
        </PremiumScrollArea>

        <BottomTabNav />
      </div>
    </div>
  );
};

export default MissionsArchive;
