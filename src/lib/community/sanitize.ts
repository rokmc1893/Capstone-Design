const TAG_PATTERN = /^[가-힣a-zA-Z0-9_]{1,20}$/;

/** HTML 태그 제거 + 길이 제한 (XSS 완화) */
export function sanitizePlainText(input: string, maxLen: number): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLen);
}

export function parseTagsInput(raw: string): string[] {
  const parts = raw
    .split(/[\s,#]+/)
    .map((t) => t.replace(/^#/, '').trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const tag = sanitizePlainText(p, 20);
    if (!TAG_PATTERN.test(tag)) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length >= 8) break;
  }
  return out;
}

export const POST_TITLE_MAX = 50;
export const POST_BODY_MAX = 4000;
export const COMMENT_BODY_MAX = 800;

export const IMAGE_MAX_BYTES = 900_000;
export const IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
