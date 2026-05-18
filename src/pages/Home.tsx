import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { BottomTabNav } from '../components/BottomTabNav';
import { MobileGlassBackdrop } from '../components/ui/MobileGlassBackdrop';
import {
  GRADIENT_BG_STYLE,
  MOBILE_FRAME,
  glassCard,
  glassIconWell,
  glassSettingsButton,
  glassStatCard,
} from '../components/ui/glassStyles';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { fetchHomeDashboard } from '../lib/homeMissionsApi';
import {
  getHomeActionPath,
  homeActionIcon,
  homeActionSubtitle,
  resolveHomeActions,
} from '../lib/homeActions';
import { getDisplayName } from '../lib/displayName';
import { usePremiumMotion } from '../lib/motionPresets';
import {
  typeBadge,
  typeCaption,
  typeCardDesc,
  typeCardTitle,
  typeGreeting,
  typeHeroTitle,
  typeStatLabel,
  typeCaptionXs,
  typeStatPlaceholder,
  typeStatValue,
} from '../lib/typography';
import { fetchLatestResultReportForHome, getRiskLevelLabel } from '../lib/resultReport';
import { useAuthStore } from '../store/useAuthStore';
import type { HomeActionDto } from '../types/backendApi';
import type { ResultReport } from '../types/resultReport';

const Home = () => {
  const navigate = useNavigate();
  const { variants, stagger, spring, cardHover, cardTap } = usePremiumMotion();
  const authNickname = useAuthStore((s) => s.user?.nickname);
  const profileName = useUserProfileStore((s) => s.name);
  const profileNickname = useUserProfileStore((s) => s.nickname);
  const userName = getDisplayName(authNickname, profileNickname, profileName);
  const risk = useSimulatorStore((s) => s.risk);
  const heightCm = useSimulatorStore((s) => s.heightCm);
  const weightKg = useSimulatorStore((s) => s.weightKg);
  const age = useSimulatorStore((s) => s.age);
  const bmi = useSimulatorStore((s) => s.bmi);
  const sleepHours = useSimulatorStore((s) => s.sleepHours);
  const smoking = useSimulatorStore((s) => s.smoking);
  const alcohol = useSimulatorStore((s) => s.alcohol);
  const stressLevel = useSimulatorStore((s) => s.stressLevel);

  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);
  const [latestReport, setLatestReport] = useState<ResultReport | null | undefined>(undefined);
  const [homeActions, setHomeActions] = useState<HomeActionDto[]>(() =>
    resolveHomeActions(null),
  );

  useEffect(() => {
    if (!hasApiBase) {
      setLatestReport(null);
      setHomeActions(resolveHomeActions(null));
      return;
    }
    let mounted = true;
    void (async () => {
      const [home, report] = await Promise.all([
        fetchHomeDashboard(),
        fetchLatestResultReportForHome(),
      ]);
      if (!mounted) return;
      setHomeActions(resolveHomeActions(home?.actions));
      const nickname = home?.user?.nickname?.trim();
      if (nickname) {
        useUserProfileStore.getState().setNickname(nickname);
        useUserProfileStore.getState().setName(nickname);
      }
      setLatestReport(report ?? null);
    })();
    return () => {
      mounted = false;
    };
  }, [hasApiBase]);

  const actionCards = useMemo(
    () => resolveHomeActions(homeActions),
    [homeActions],
  );

  const latestResultId = latestReport?.resultId ?? null;
  const hasInspectionResult = heightCm > 0 && weightKg > 0;

  const riskFactors = useMemo(() => {
    const factors: { label: string; value: number }[] = [];
    if (age >= 40) factors.push({ label: '나이', value: 25 });
    else if (age >= 35) factors.push({ label: '나이', value: 15 });
    if (bmi >= 25) factors.push({ label: 'BMI', value: 15 });
    else if (bmi >= 23) factors.push({ label: 'BMI', value: 10 });
    if (sleepHours < 6) factors.push({ label: '수면', value: 15 });
    else if (sleepHours < 7) factors.push({ label: '수면', value: 8 });
    if (smoking === 'often') factors.push({ label: '흡연', value: 18 });
    else if (smoking === 'sometimes') factors.push({ label: '흡연', value: 10 });
    if (alcohol === 'often') factors.push({ label: '음주', value: 12 });
    else if (alcohol === 'sometimes') factors.push({ label: '음주', value: 6 });
    if (stressLevel > 0) factors.push({ label: '스트레스', value: stressLevel * 2 });
    return factors.sort((a, b) => b.value - a.value);
  }, [age, alcohol, bmi, sleepHours, smoking, stressLevel]);

  const serverFactors = useMemo(() => {
    if (!latestReport) return null;
    if (latestReport.topFactors?.length) return latestReport.topFactors;
    if (latestReport.factorAnalyses?.length) {
      return latestReport.factorAnalyses.map((f) => ({ label: f.factor, value: 0 }));
    }
    if (latestReport.coreRiskBullets?.length) {
      return latestReport.coreRiskBullets.slice(0, 6).map((t) => ({
        label: t.length > 28 ? `${t.slice(0, 28)}…` : t,
        value: 0,
      }));
    }
    return null;
  }, [latestReport]);

  const showServerCards = hasApiBase && latestReport !== undefined && latestReport !== null;
  const showServerEmpty = hasApiBase && latestReport === null;
  const serverLoading = hasApiBase && latestReport === undefined;

  return (
    <motion.div className="flex min-h-screen items-center justify-center bg-[#f4f2fa] p-4">
      <motion.div
        className={MOBILE_FRAME}
        style={GRADIENT_BG_STYLE}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
      >
        <MobileGlassBackdrop />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-6 pt-12 pb-[104px]">
          <motion.header
            className="flex items-start justify-between gap-4"
            initial="hidden"
            animate="visible"
            variants={variants}
          >
            <div className="min-w-0">
              <p className={typeGreeting}>반가워요, {userName} 님!</p>
              <h1 className={`mt-2.5 ${typeHeroTitle} drop-shadow-[0_2px_16px_rgba(0,0,0,0.1)]`}>
                오늘 하루도
                <br />
                좋은 결과가 있길
              </h1>
            </div>
            <motion.button
              type="button"
              aria-label="설정"
              onClick={() => navigate('/settings')}
              className={glassSettingsButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={spring}
            >
              <SettingsIcon className="h-5 w-5" strokeWidth={2} />
            </motion.button>
          </motion.header>

          <motion.section
            className="mt-9 grid grid-cols-2 gap-3.5"
            aria-label="메인 메뉴"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {actionCards.map((action) => {
              const path = getHomeActionPath(action.type, { latestResultId });
              const Icon = homeActionIcon(action.type);
              const subtitle = homeActionSubtitle(action.type);
              return (
                <motion.button
                  key={action.type}
                  type="button"
                  variants={variants}
                  disabled={!path}
                  onClick={() => {
                    if (path) navigate(path);
                  }}
                  whileHover={cardHover}
                  whileTap={cardTap}
                  transition={spring}
                  className={`group relative flex min-h-[122px] w-full flex-col justify-between p-5 text-left disabled:opacity-45 ${glassCard}`}
                >
                  <div className="min-w-0 pr-1">
                    <p className={typeCardTitle}>{action.title}</p>
                    {subtitle ? <p className={`mt-2 ${typeCardDesc}`}>{subtitle}</p> : null}
                  </div>
                  <div className={`mt-5 ${glassIconWell}`}>
                    <Icon className="h-5 w-5 text-white/90" aria-hidden />
                  </div>
                  <span className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.14] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.button>
              );
            })}
          </motion.section>

          <motion.section
            className="mt-7 grid grid-cols-2 gap-3.5"
            aria-label="검사 요약"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div
              variants={variants}
              className={`${glassStatCard} flex min-h-[124px] flex-col px-5 py-5`}
            >
              <p className={typeStatLabel}>최근 검사 결과</p>
              <div className="relative mt-auto flex flex-1 flex-col justify-end pt-3">
                <motion.div className="pointer-events-none absolute -right-2 bottom-2 h-16 w-16 rounded-full bg-white/10 blur-2xl" aria-hidden />
                {serverLoading ? (
                  <p className={typeCaption}>불러오는 중…</p>
                ) : showServerCards ? (
                  <>
                    <motion.p
                      key={`score-${latestReport.score}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={typeStatValue}
                    >
                      {latestReport.score}점
                    </motion.p>
                    <p className={`mt-2.5 inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}>
                      {getRiskLevelLabel(latestReport.riskLevel)}
                    </p>
                  </>
                ) : showServerEmpty || !hasInspectionResult ? (
                  <p className={typeStatPlaceholder}>---</p>
                ) : (
                  <>
                    <motion.p
                      key={`risk-${risk}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={typeStatValue}
                    >
                      {risk.toFixed(0)}점
                    </motion.p>
                    <p className={`mt-2.5 inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}>
                      {risk < 30 ? '양호' : risk < 60 ? '주의' : '고위험'}
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={variants}
              className={`${glassStatCard} flex min-h-[124px] flex-col px-5 py-5`}
            >
              <p className={typeStatLabel}>주요 요인</p>
              <div className="relative mt-auto flex flex-1 flex-col justify-end pt-3">
                <div
                  className="pointer-events-none absolute -left-1 bottom-0 h-14 w-14 rounded-full bg-[#F9A8D4]/20 blur-2xl"
                  aria-hidden
                />
                {serverLoading ? (
                  <p className={typeCaption}>불러오는 중…</p>
                ) : showServerCards ? (
                  <motion.div className="flex flex-wrap gap-1.5">
                    {serverFactors && serverFactors.length > 0 ? (
                      serverFactors.map((factor) => (
                        <span
                          key={`${factor.label}-${factor.value}`}
                          className={`inline-flex max-w-full rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}
                        >
                          {factor.label}
                        </span>
                      ))
                    ) : (
                      <p className={typeCaptionXs}>표시할 주요 요인이 없습니다.</p>
                    )}
                  </motion.div>
                ) : showServerEmpty || (!hasInspectionResult && !showServerCards) ? (
                  <p className={typeStatPlaceholder}>---</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {riskFactors.map((factor) => (
                      <span
                        key={factor.label}
                        className={`inline-flex max-w-full rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}
                      >
                        {factor.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.section>
        </div>

        <BottomTabNav />
      </motion.div>
    </motion.div>
  );
};

export default Home;
