import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { HomeScoreGauge } from '../components/home/HomeScoreGauge';
import {
  glassHomeActionRow,
  glassIconWell,
  glassSettingsButton,
  glassStatCard,
} from '../components/ui/glassStyles';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import {
  fetchHomeDashboard,
  fetchUserMe,
  pickDailyRewardCapFromHome,
} from '../lib/homeMissionsApi';
import { applyUserMeToStores } from '../lib/userProfileSync';
import { fetchHomeSummaryWithFallback } from '../lib/fetchHomeSummary';
import { refreshUserProfileFromServer } from '../lib/userProfileApi';
import type { HomeSummary } from '../lib/homeSummary';
import {
  getHomeActionPath,
  homeActionIcon,
  homeActionSubtitle,
  resolveHomePrimaryActions,
} from '../lib/homeActions';
import { inspectionReportDetailPath } from '../lib/inspectionReportNav';
import { getDisplayName } from '../lib/displayName';
import { wellnessScoreFromRisk } from '../lib/inspectionReportDerived';
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
} from '../lib/typography';
import { getRiskLevelLabel } from '../lib/resultReport';
import { useAuthStore } from '../store/useAuthStore';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';
import type { HomeActionDto } from '../types/backendApi';

const Home = () => {
  const navigate = useNavigate();
  const { variants, stagger, spring, cardHover, cardTap } = usePremiumMotion();
  const accessToken = useAuthStore((s) => s.accessToken);
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
  const [homeSummary, setHomeSummary] = useState<HomeSummary | null | undefined>(undefined);
  const [homeActions, setHomeActions] = useState<HomeActionDto[]>(() =>
    resolveHomePrimaryActions(null),
  );

  const loadHomeData = useCallback(async () => {
    if (!hasApiBase) {
      setHomeSummary(null);
      setHomeActions(resolveHomePrimaryActions(null, { hasRecentTest: false }));
      return;
    }
    const [home, me] = await Promise.all([
      fetchHomeDashboard(),
      accessToken ? fetchUserMe().catch(() => null) : Promise.resolve(null),
    ]);
    if (me) applyUserMeToStores(me);

    const nickname = home?.user?.nickname?.trim();
    if (nickname) {
      useUserProfileStore.getState().setNickname(nickname);
    }
    if (pickDailyRewardCapFromHome(home)) {
      useBloomMissionsStore.getState().syncDailyRewardCapReached(true);
    }
    const summary = await fetchHomeSummaryWithFallback(home);
    setHomeSummary(summary);
    setHomeActions(
      resolveHomePrimaryActions(home?.actions, {
        hasRecentTest: summary != null && summary.resultId != null,
      }),
    );
  }, [hasApiBase, accessToken]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await loadHomeData();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [loadHomeData]);

  useEffect(() => {
    if (!hasApiBase || !accessToken) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshUserProfileFromServer();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [hasApiBase, accessToken]);

  const latestResultId = homeSummary?.resultId ?? null;

  const primaryActions = useMemo(
    () =>
      resolveHomePrimaryActions(homeActions, {
        hasRecentTest: latestResultId != null && latestResultId > 0,
      }),
    [homeActions, latestResultId],
  );

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

  const showServerSummary = hasApiBase && homeSummary !== undefined && homeSummary !== null;
  const showServerEmpty = hasApiBase && homeSummary === null;
  const serverLoading = hasApiBase && homeSummary === undefined;
  const canOpenLatestReport =
    latestResultId != null && latestResultId > 0 && !serverLoading;

  const displayScore = useMemo(() => {
    if (showServerSummary && homeSummary?.score != null) return homeSummary.score;
    if (hasInspectionResult) return wellnessScoreFromRisk(risk);
    return null;
  }, [showServerSummary, homeSummary, hasInspectionResult, risk]);

  const displayRiskLabel = useMemo(() => {
    if (showServerSummary && homeSummary?.riskLevel) {
      return getRiskLevelLabel(homeSummary.riskLevel);
    }
    if (hasInspectionResult) {
      return risk < 30 ? '양호' : risk < 60 ? '주의' : '고위험';
    }
    return null;
  }, [showServerSummary, homeSummary, hasInspectionResult, risk]);

  const factorChips = useMemo(() => {
    if (serverLoading) return null;
    if (showServerSummary && homeSummary) {
      return homeSummary.topFactors.length > 0
        ? homeSummary.topFactors.slice(0, 4).map((label) => ({ label, value: 0 }))
        : [];
    }
    if (showServerEmpty || !hasInspectionResult) return [];
    return riskFactors.slice(0, 4);
  }, [
    serverLoading,
    showServerSummary,
    homeSummary,
    showServerEmpty,
    hasInspectionResult,
    riskFactors,
  ]);

  const hasMoreFactors =
    showServerSummary && homeSummary
      ? homeSummary.topFactors.length > 4
      : riskFactors.length > 4;

  return (
    <motion.div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain px-6 pt-12 pb-[104px]">
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
        className="mt-6 grid grid-cols-2 gap-3.5"
        aria-label="검사 요약"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={variants} className="min-h-[148px]">
          {canOpenLatestReport ? (
            <button
              type="button"
              onClick={() => navigate(inspectionReportDetailPath(latestResultId!))}
              className={`${glassStatCard} flex h-full min-h-[148px] w-full flex-col px-4 py-4 text-left transition active:scale-[0.98]`}
              aria-label="최근 검사 결과 상세 리포트 보기"
            >
              <p className={typeStatLabel}>최근 검사 결과</p>
              <div className="relative mt-2 flex flex-1 flex-col items-center justify-center">
                <HomeScoreGauge score={displayScore!} />
                {displayRiskLabel ? (
                  <p
                    className={`mt-2 inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}
                  >
                    {displayRiskLabel}
                  </p>
                ) : null}
              </div>
            </button>
          ) : (
            <div className={`${glassStatCard} flex min-h-[148px] flex-col px-4 py-4`}>
              <p className={typeStatLabel}>최근 검사 결과</p>
              <div className="relative mt-2 flex flex-1 flex-col items-center justify-center">
                {serverLoading ? (
                  <p className={typeCaption}>불러오는 중…</p>
                ) : displayScore != null ? (
                  <>
                    <HomeScoreGauge score={displayScore} />
                    {displayRiskLabel ? (
                      <p
                        className={`mt-2 inline-flex w-fit rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}
                      >
                        {displayRiskLabel}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className={typeStatPlaceholder}>---</p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={variants}
          className={`${glassStatCard} flex min-h-[148px] flex-col px-4 py-4`}
        >
          <p className={typeStatLabel}>주요 요인</p>
          <div className="relative mt-3 flex flex-1 flex-col justify-center">
            {serverLoading ? (
              <p className={typeCaption}>불러오는 중…</p>
            ) : factorChips && factorChips.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {factorChips.map((factor) => (
                  <span
                    key={factor.label}
                    className={`inline-flex max-w-full truncate rounded-full border border-white/20 bg-white/12 px-2.5 py-1 ${typeBadge}`}
                  >
                    {factor.label}
                  </span>
                ))}
                {hasMoreFactors ? (
                  <span className={`${typeBadge} text-white/60`}>…</span>
                ) : null}
              </div>
            ) : showServerSummary ? (
              <p className={typeCaptionXs}>표시할 주요 요인이 없습니다.</p>
            ) : (
              <p className={typeStatPlaceholder}>---</p>
            )}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="mt-5 flex flex-col gap-3.5"
        aria-label="메인 메뉴"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {primaryActions.map((action) => {
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
              className={`group relative disabled:opacity-45 ${glassHomeActionRow}`}
            >
              <div className="min-w-0 flex-1">
                <p className={typeCardTitle}>{action.title}</p>
                {subtitle ? <p className={`mt-1.5 ${typeCardDesc}`}>{subtitle}</p> : null}
              </div>
              <div className={glassIconWell}>
                <Icon className="h-5 w-5 text-white/90" aria-hidden />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.14] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </motion.section>
    </motion.div>
  );
};

export default Home;
