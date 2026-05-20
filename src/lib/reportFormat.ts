/** 리포트 상단 검사일·보관함 카드용 */
export function formatReportDateLong(dateIso: string, week?: number): string {
  const m = dateIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return dateIso;
  const year = m[1];
  const month = Number.parseInt(m[2], 10);
  const day = Number.parseInt(m[3], 10);
  if (week != null && week > 0) {
    return `${year}년 ${month}월 ${week}주차`;
  }
  return `${year}년 ${month}월 ${day}일`;
}

export function formatArchiveDateShort(iso: string): string {
  if (iso.length >= 10) return iso.slice(0, 10);
  return iso;
}
