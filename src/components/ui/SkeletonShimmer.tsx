type SkeletonShimmerProps = {
  className?: string;
};

/** 프리미엄 로딩 — 은은한 shimmer */
export function SkeletonShimmer({ className = '' }: SkeletonShimmerProps) {
  return (
    <div
      className={[
        'skeleton-shimmer rounded-[24px] border border-white/[0.1] bg-white/[0.07]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    />
  );
}
