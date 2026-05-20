import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { COMMUNITY_REPORT_REASONS } from '../../lib/community/reportReasons';
import type { CommunityReportReason } from '../../types/community';

type ReportBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: CommunityReportReason) => void;
};

export function ReportBottomSheet({ open, onClose, onSubmit }: ReportBottomSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="닫기"
            className="fixed inset-0 z-[70] bg-[#1a1528]/40 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-sheet-title"
            className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[390px] px-4 pb-[max(20px,env(safe-area-inset-bottom))]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="overflow-hidden rounded-[28px] border border-white/25 bg-white/[0.12] shadow-[0_-8px_48px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
                <h2
                  id="report-sheet-title"
                  className="text-[17px] font-bold tracking-[-0.03em] text-white/95"
                >
                  신고 사유를 선택해 주세요
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white/80 transition active:scale-95"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="px-5 pt-3 text-[13px] leading-relaxed text-white/65">
                신고된 글은 목록에서 숨겨지며, 더 나은 커뮤니티를 위해 검토됩니다.
              </p>
              <ul className="space-y-1 px-3 py-3">
                {COMMUNITY_REPORT_REASONS.map((reason) => (
                  <li key={reason.id}>
                    <button
                      type="button"
                      onClick={() => onSubmit(reason.id)}
                      className="flex w-full items-center rounded-[16px] px-4 py-3.5 text-left text-[15px] font-medium tracking-[-0.02em] text-white/92 transition hover:bg-white/10 active:scale-[0.99] active:bg-white/14"
                    >
                      {reason.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/12 px-5 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-[16px] py-3 text-[15px] font-semibold text-white/70 transition active:bg-white/8"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
