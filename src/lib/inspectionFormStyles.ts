import { typeFormInput } from './typography';

/** 검사 설문 공통 입력 필드 */
export const inspectionInputClassName = [
  typeFormInput,
  'w-full rounded-[14px] border border-black/10 bg-[#F4F4F6] px-4 py-3.5',
  'shadow-inner shadow-black/[0.03] outline-none transition',
  'placeholder:font-medium placeholder:text-[#A8A8AE]/90',
  'focus:border-[#9388FA] focus:bg-white focus:ring-2 focus:ring-[#9388FA]/35',
].join(' ');
