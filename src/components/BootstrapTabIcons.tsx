/**
 * Bootstrap Icons (MIT) — https://icons.getbootstrap.com/
 * 홈 하단 탭용: house, bullseye, people
 */
import type { SVGProps } from 'react';

const iconProps = {
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  'aria-hidden': true as const,
};

export function BsHouse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
    </svg>
  );
}

export function BsBullseye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10zm0 1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
      <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}

export function BsPeople(props: SVGProps<SVGSVGElement>) {
  // 단일 사람 아이콘 (Bootstrap person-outline 느낌)
  return (
    <svg {...iconProps} {...props}>
      <path d="M8 8a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 1C5.33 9 2 10.34 2 12.5V14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1.5C14 10.34 10.67 9 8 9z" />
    </svg>
  );
}
