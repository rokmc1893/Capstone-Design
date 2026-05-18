import { motion } from 'framer-motion';

/** iPhone 프레임 내부 퍼플→핑크 그라디언트 + 소프트 글로우 */
export function MobileGlassBackdrop() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="absolute -top-28 left-[-48px] h-[260px] w-[260px] rounded-full bg-white/25 blur-[40px]" />
      <div className="absolute top-[180px] right-[-80px] h-[280px] w-[280px] rounded-full bg-[#F9A8D4]/35 blur-[48px]" />
      <div className="absolute bottom-[-40px] left-1/2 h-[200px] w-[220px] -translate-x-1/2 rounded-full bg-[#C4B5FD]/30 blur-[44px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.04]" />
    </motion.div>
  );
}
