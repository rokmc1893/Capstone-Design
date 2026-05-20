import { memo } from 'react';

type UserAvatarProps = {
  name: string;
  size?: 'sm' | 'md';
};

function initials(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  if (t.length <= 2) return t;
  return t.slice(0, 2);
}

export const UserAvatar = memo(function UserAvatar({ name, size = 'md' }: UserAvatarProps) {
  const dim = size === 'sm' ? 'h-9 w-9 text-[12px]' : 'h-11 w-11 text-[13px]';
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold text-white ring-2 ring-white/30`}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
});
