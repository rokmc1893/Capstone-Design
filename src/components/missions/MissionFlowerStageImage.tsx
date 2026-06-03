type MissionFlowerStageImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** 미션 메인 영역(크게) vs 썸네일 */
  variant?: 'hero' | 'thumb';
};

const MASK_HERO =
  'mask-[radial-gradient(ellipse_72%_84%_at_50%_78%,#000_62%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_72%_84%_at_50%_78%,#000_62%,transparent_100%)]';
const MASK_THUMB =
  'mask-[radial-gradient(ellipse_78%_88%_at_50%_74%,#000_55%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_78%_88%_at_50%_74%,#000_55%,transparent_100%)]';

/**
 * 단계 PNG 가장자리 프린지·스케일 업 시 보이는 사각형 아티팩트 완화.
 * (부모에 backdrop-blur가 있으면 프린지가 더 도드라지므로, 식물 영역 카드는 blur 없이 쓰는 것을 권장)
 */
export function MissionFlowerStageImage({
  src,
  alt,
  className = '',
  variant = 'hero',
}: MissionFlowerStageImageProps) {
  const maskClass = variant === 'thumb' ? MASK_THUMB : MASK_HERO;
  const sizeClass =
    variant === 'thumb'
      ? 'h-full w-full max-h-full max-w-full object-contain p-1'
      : 'max-h-[200px] w-auto max-w-full object-contain object-bottom';

  return (
    <div
      className={[
        'relative flex items-center justify-center',
        maskClass,
        'mask-no-repeat mask-size-[100%_100%]',
        variant === 'hero' ? 'min-h-[140px] w-full max-w-[240px]' : 'h-full w-full',
      ].join(' ')}
    >
      <img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className={[
          sizeClass,
          'select-none',
          'drop-shadow-[0_12px_28px_rgba(15,23,42,0.45)]',
          'transition-opacity duration-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  );
}
