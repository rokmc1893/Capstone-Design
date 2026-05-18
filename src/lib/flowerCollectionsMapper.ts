import { flowerIdFromBackendCode } from './backendFlowerCode';
import type { BloomRecordEntry } from '../store/useBloomMissionsStore';
import type { FlowerCollectionEntryDto } from '../types/backendApi';
export function mapFlowerCollectionEntry(
  entry: FlowerCollectionEntryDto,
): BloomRecordEntry | null {
  const code = entry.flowerType ?? (entry as { flowerCode?: string }).flowerCode;
  const flowerId = flowerIdFromBackendCode(code);
  if (!flowerId) return null;

  const completedAt =
    entry.achievedAt ??
    (entry as { completedAt?: string }).completedAt ??
    '';

  return { flowerId, completedAt };
}

export function mapFlowerCollectionsToBloomRecords(
  entries: FlowerCollectionEntryDto[],
): BloomRecordEntry[] {
  const mapped = entries
    .map(mapFlowerCollectionEntry)
    .filter((e): e is BloomRecordEntry => e != null);

  return [...mapped].sort((a, b) => {
    const ta = Date.parse(a.completedAt);
    const tb = Date.parse(b.completedAt);
    if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
    return 0;
  });
}

export function mergeBloomRecordsUnique(
  server: BloomRecordEntry[],
  local: BloomRecordEntry[],
): BloomRecordEntry[] {
  const seen = new Set<string>();
  const out: BloomRecordEntry[] = [];
  for (const entry of [...server, ...local]) {
    const key = `${entry.flowerId}:${entry.completedAt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out.sort((a, b) => {
    const ta = Date.parse(a.completedAt);
    const tb = Date.parse(b.completedAt);
    if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
    return 0;
  });
}
