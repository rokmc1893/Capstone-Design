import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { GenderCharacterArt } from '../components/illustrations/GenderCharacterArt';
import { StatusBar } from '../components/StatusBar';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import {
  GRADIENT_BG_STYLE,
  MOBILE_FRAME,
  glassCard,
  glassSettingsButton,
} from '../components/ui/glassStyles';
import { fadeUp, springPremium, staggerSection } from '../lib/motionPresets';
import { startTestSessionAfterGenderPick } from '../lib/startTestSession';
import { typeBodySm, typeScreenTitleLg } from '../lib/typography';
import { refreshUserProfileFromServer } from '../lib/userProfileApi';
import { profileGenderToSimulator } from '../lib/userProfileGender';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useTestSessionStore } from '../store/useTestSessionStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

const InspectionGender = () => {
  const navigate = useNavigate();
  const setGender = useSimulatorStore((s) => s.setGender);
  const profileGender = useUserProfileStore((s) => s.gender);
  const [selected, setSelected] = useState<'male' | 'female' | null>(() =>
    profileGenderToSimulator(profileGender),
  );
  const navigateLock = useRef(false);

  useEffect(() => {
    void refreshUserProfileFromServer().then(() => {
      const g = profileGenderToSimulator(useUserProfileStore.getState().gender);
      setSelected(g);
    });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  }, [navigate]);

  const handleSelect = async (g: 'male' | 'female') => {
    if (navigateLock.current) return;
    setSelected(g);
    navigateLock.current = true;
    window.setTimeout(async () => {
      setGender(g);
      const sessionId = await startTestSessionAfterGenderPick(g);
      if (sessionId) {
        useTestSessionStore.getState().setSessionId(sessionId);
      } else {
        useTestSessionStore.getState().clearSession();
      }
      if (g === 'female') navigate('/inspection/female/1');
      else navigate('/inspection/male/1');
      navigateLock.current = false;
    }, 320);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2fa] p-4">
      <motion.div
        className={`${MOBILE_FRAME} h-[min(844px,100dvh)] max-h-[852px]`}
        style={GRADIENT_BG_STYLE}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springPremium}
      >
        <MobileGlassBackdrop />

        <header className="relative z-10 shrink-0 pt-2">
          <StatusBar />
        </header>

        <div className="relative z-10 flex shrink-0 items-center justify-between px-6 pb-2 pt-1">
          <button
            type="button"
            onClick={goBack}
            className="type-inspect-back flex min-w-0 items-center gap-0.5 active:opacity-80"
          >
            <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="truncate">검사하기</span>
          </button>
          <motion.button
            type="button"
            aria-label="설정"
            onClick={() => navigate('/settings')}
            className={glassSettingsButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={springPremium}
          >
            <Settings className="h-5 w-5" strokeWidth={2} />
          </motion.button>
        </div>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-6 pb-10 pt-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center"
          >
            <h1 className={`${typeScreenTitleLg} drop-shadow-[0_2px_16px_rgba(0,0,0,0.12)]`}>
              성별을 선택해주세요
            </h1>
            <p className={`mt-2.5 ${typeBodySm}`}>
              성별에 맞는 간단한 설문 후 진단을 이어가요.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-9 grid w-full max-w-[340px] grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={staggerSection}
          >
            {(['male', 'female'] as const).map((g) => {
              const isSelected = selected === g;
              return (
                <motion.button
                  key={g}
                  type="button"
                  variants={fadeUp}
                  onClick={() => void handleSelect(g)}
                  animate={{
                    scale: isSelected ? 1.04 : 1,
                    borderColor: isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                    boxShadow: isSelected
                      ? '0 20px 50px rgba(147,136,250,0.4), 0 0 0 1px rgba(255,255,255,0.35)'
                      : '0 20px 50px rgba(15,23,42,0.22)',
                  }}
                  whileHover={{ y: -4, scale: isSelected ? 1.04 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springPremium}
                  className={`${glassCard} flex min-h-[272px] flex-col items-center overflow-hidden p-4`}
                >
                  <GenderCharacterArt variant={g} className="h-[168px] w-full max-w-[140px]" />
                  <span className="type-card-title mt-3">
                    {g === 'male' ? '남성' : '여성'}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default InspectionGender;
