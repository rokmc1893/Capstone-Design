import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSessionCareHeadline, splitCareHeadlineLines } from '../data/homeCareHeadlines';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { HomeScoreGauge } from '../components/home/HomeScoreGauge';
import {
  glassHomePrimaryCta,
  glassHomePrimaryIconWell,
  glassHomeSecondaryCta,
  glassHomeStatCard,
  glassIconWell,
  glassSettingsButton,
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
  normalizeHomeActionType,
  resolveHomePrimaryActions,
} from '../lib/homeActions';
import { inspectionReportDetailPath } from '../lib/inspectionReportNav';
import { getDisplayName } from '../lib/displayName';
import { wellnessScoreFromRisk } from '../lib/inspectionReportDerived';
import {
  homeCtaStack,
  homeCtaTextStack,
  homeFactorChip,
  homeFactorStack,
  homeHeroStack,
  homePage,
  homeSectionGap,
  homeStatBody,
  homeStatCardShell,
  homeStatsGrid,
} from '../lib/homeSpacing';
import { usePremiumMotion } from '../lib/motionPresets';
import {
  typeBadge,
  typeCaption,
  typeCardDesc,
  typeCardTitle,
  typeHomeCareHeadline,
  typeHomeGreeting,
  typeStatLabel,
  typeCaptionXs,
  typeStatPlaceholder,
} from '../lib/typography';
import { getRiskLevelLabel } from '../lib/resultReport';
import { useAuthStore } from '../store/useAuthStore';
import { useBloomMissionsStore } from '../store/useBloomMissionsStore';
import type { HomeActionDto } from '../types/backendApi';

function isPrimaryHomeAction(type: string | undefined): boolean {
  return normalizeHomeActionType(type) === 'TEST';
}

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
  const [careHeadline] = useState(() => getSessionCareHeadline());
  const careHeadlineLines = useMemo(
    () => splitCareHeadlineLines(careHeadline),
    [careHeadline],
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

  const riskBadgeClass = `inline-flex w-fit rounded-full border border-white/22 bg-white/14 px-3 py-1.5 ${typeBadge}`;

  const renderScoreCardBody = () => {
    if (serverLoading) {
      return <p className={`flex flex-1 items-center justify-center ${typeCaption}`}>불러오는 중…</p>;
    }
    if (displayScore != null) {
      return (
        <>
          <div className="flex flex-1 items-center justify-center py-2">
            <HomeScoreGauge score={displayScore} />
          </div>
          {displayRiskLabel ? <p className={riskBadgeClass}>{displayRiskLabel}</p> : null}
        </>
      );
    }
    return <p className={`flex flex-1 items-center justify-center ${typeStatPlaceholder}`}>---</p>;
  };

  return (
    <motion.div className={homePage}>
      <motion.header
        className="flex items-start justify-between gap-5"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <div className="min-w-0 flex-1 pr-3">
          <p className={typeHomeGreeting}>반가워요, {userName} 님</p>
          <motion.h1
            key={careHeadline}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className={`${homeHeroStack} ${typeHomeCareHeadline} drop-shadow-[0_2px_20px_rgba(0,0,0,0.12)]`}
          >
            {careHeadlineLines.map((line, index) => (
              <span key={`${careHeadline}-${index}`} className="block">
                {line}
              </span>
            ))}
          </motion.h1>
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
        className={`${homeSectionGap} ${homeStatsGrid}`}
        aria-label="검사 요약"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={variants} className="min-h-[164px]">
          {canOpenLatestReport ? (
            <button
              type="button"
              onClick={() => navigate(inspectionReportDetailPath(latestResultId!))}
              className={`${glassHomeStatCard} ${homeStatCardShell} h-full w-full text-left transition active:scale-[0.98]`}
              aria-label="최근 검사 결과 상세 리포트 보기"
            >
              <p className={typeStatLabel}>최근 검사 결과</p>
              <div className={`${homeStatBody} items-center justify-between`}>
                {renderScoreCardBody()}
              </div>
            </button>
          ) : (
            <div className={`${glassHomeStatCard} ${homeStatCardShell}`}>
              <p className={typeStatLabel}>최근 검사 결과</p>
              <div className={`${homeStatBody} items-center justify-between`}>
                {renderScoreCardBody()}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={variants} className={`${glassHomeStatCard} ${homeStatCardShell}`}>
          <p className={typeStatLabel}>주요 요인</p>
          <div className={`${homeStatBody} justify-center py-1`}>
            {serverLoading ? (
              <p className={typeCaption}>불러오는 중…</p>
            ) : factorChips && factorChips.length > 0 ? (
              <div className={homeFactorStack}>
                {factorChips.map((factor) => (
                  <span key={factor.label} className={`${homeFactorChip} ${typeBadge}`}>
                    {factor.label}
                  </span>
                ))}
                {hasMoreFactors ? (
                  <span className={`pl-1 ${typeBadge} text-white/55`}>…</span>
                ) : null}
              </div>
            ) : showServerSummary ? (
              <p className={`${typeCaptionXs} leading-relaxed`}>표시할 주요 요인이 없습니다.</p>
            ) : (
              <p className={typeStatPlaceholder}>---</p>
            )}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className={`${homeSectionGap} ${homeCtaStack}`}
        aria-label="메인 메뉴"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {primaryActions.map((action) => {
          const path = getHomeActionPath(action.type, { latestResultId });
          const Icon = homeActionIcon(action.type);
          const subtitle = homeActionSubtitle(action.type);
          const isPrimary = isPrimaryHomeAction(action.type);
          const rowClass = isPrimary ? glassHomePrimaryCta : glassHomeSecondaryCta;
          const iconWellClass = isPrimary ? glassHomePrimaryIconWell : glassIconWell;

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
              className={`group disabled:opacity-45 ${rowClass}`}
            >
              <div className="relative z-[1] min-w-0 flex-1">
                <p className={isPrimary ? `${typeCardTitle} text-white` : typeCardTitle}>
                  {action.title}
                </p>
                {subtitle ? (
                  <p
                    className={`${homeCtaTextStack} ${isPrimary ? 'text-white/82' : ''} ${typeCardDesc}`}
                  >
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <div className={`relative z-[1] ${iconWellClass}`}>
                <Icon className="h-5 w-5 text-white/90" aria-hidden />
              </div>
              {isPrimary ? (
                <span
                  className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.22] via-white/[0.06] to-transparent opacity-100"
                  aria-hidden
                />
              ) : (
                <span className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/[0.1] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              )}
            </motion.button>
          );
        })}
      </motion.section>
    </motion.div>
  );
};

export default Home;
