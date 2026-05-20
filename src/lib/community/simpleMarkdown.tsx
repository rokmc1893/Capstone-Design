import type { ReactNode } from 'react';

/** 의존성 없이 기본 마크다운(굵게·목록·줄바꿈)만 렌더 */
export function renderSimpleMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts: ReactNode[] = [];
    const re = /\*\*(.+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let key = 0;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) {
        parts.push(line.slice(last, m.index));
      }
      parts.push(
        <strong key={`${lineIdx}-b-${key++}`} className="font-semibold text-white">
          {m[1]}
        </strong>,
      );
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    if (line.startsWith('- ')) {
      return (
        <p key={lineIdx} className="pl-3 before:mr-2 before:content-['•']">
          {parts.length ? parts : line.slice(2)}
        </p>
      );
    }
    return (
      <p key={lineIdx} className={lineIdx > 0 ? 'mt-2' : undefined}>
        {parts.length ? parts : line || '\u00a0'}
      </p>
    );
  });
}
