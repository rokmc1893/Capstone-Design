import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { COMMUNITY_REPORT_REASONS } from '../../lib/community/reportReasons';
import { communityEaseSoft } from '../../lib/community/interactionMotion';
import { BOTTOM_TAB_RESERVED_PX } from '../../lib/mobileFrame';
import { glassCommunityBottomSheet } from '../ui/glassStyles';
import type { CommunityReportReason } from '../../types/community';

type ReportBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: CommunityReportReason) => void;
};

export function ReportBottomSheet({ open, onClose, onSubmit }: ReportBottomSheetProps) {
  const [pending, setPending] = useState<CommunityReportReason | null>(null);

  const handlePick = (reason: CommunityReportReason) => {
    setPending(reason);
    window.setTimeout(() => {
      onSubmit(reason);
      setPending(null);
    }, 180);
  };

  const handleClose = () => {
    setPending(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="닫기"
            className="fixed inset-0 z-[70] bg-[#1a1528]/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: communityEaseSoft }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-sheet-title"
            className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-[390px] px-4"
            style={{
              paddingBottom: `calc(max(20px, env(safe-area-inset-bottom, 0px)) + ${BOTTOM_TAB_RESERVED_PX}px)`,
            }}
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
          >
            <div className={glassCommunityBottomSheet}>
              <div className="flex justify-center pt-3 pb-1" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-white/35" />
              </div>
              <div className="flex items-center justify-between border-b border-white/15 px-5 py-3.5">
                <h2
                  id="report-sheet-title"
                  className="text-[17px] font-bold tracking-[-0.03em] text-white/95"
                >
                  신고 사유를 선택해 주세요
                </h2>
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white/80"
                  aria-label="닫기"
                  whileTap={{ scale: 0.92 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="break-keep px-5 pt-2 pb-1 text-[13px] leading-relaxed text-white/62">
                신고된 글은 목록에서 숨겨지며, 더 나은 커뮤니티를 위해 검토됩니다.
              </p>
              <ul className="space-y-1 px-3 py-3">
                {COMMUNITY_REPORT_REASONS.map((reason) => {
                  const selected = pending === reason.id;
                  return (
                    <li key={reason.id}>
                      <motion.button
                        type="button"
                        onClick={() => handlePick(reason.id)}
                        className={[
                          'flex w-full items-center rounded-[16px] px-4 py-3.5 text-left text-[15px] font-medium tracking-[-0.02em]',
                          selected
                            ? 'bg-white/22 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                            : 'text-white/92 hover:bg-white/10',
                        ].join(' ')}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        {reason.label}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-white/12 px-5 py-3">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-[16px] py-3 text-[15px] font-semibold text-white/70"
                  whileTap={{ scale: 0.98 }}
                >
                  취소
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
