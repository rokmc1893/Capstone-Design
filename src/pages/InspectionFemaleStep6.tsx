import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { InspectionPssStepPage } from '../components/inspection/InspectionPssStepPage';
import { navigateAfterTestSubmit } from '../lib/inspectionReportNav';
import { postTestSubmitFromStore } from '../lib/testsSessionApi';
import { syncFemaleInspectionProgressStep } from '../lib/testsSessionSync';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useTestSessionStore } from '../store/useTestSessionStore';

/** 여성 검사 Step 6/6 (PSS 7~10 + submit) */
const InspectionFemaleStep6 = () => {
  const navigate = useNavigate();
  const applyInspectionMaleStep7 = useSimulatorStore((s) => s.applyInspectionMaleStep7);

  const onSubmitResult = useCallback(async () => {
    const sessionId = useTestSessionStore.getState().sessionId;
    const base = import.meta.env.VITE_API_BASE_URL;
    if (base && sessionId) {
      try {
        const submitResult = await postTestSubmitFromStore(
          sessionId,
          useSimulatorStore.getState().pssAnswers,
        );
        useTestSessionStore.getState().clearSession();
        navigateAfterTestSubmit(navigate, submitResult);
        return;
      } catch {
        /* 세션 유지 후 보관함에서 재시도 가능 */
      }
    }
    navigate('/inspection-reports/archive');
  }, [navigate]);

  return (
    <InspectionPssStepPage
      expectedGender="female"
      progressText="6 / 6"
      backPath="/inspection/female/5"
      mode="submit"
      questions={[
        {
          number: 7,
          index: 6,
          text: '일상생활의 짜증을 얼마나 자주 잘 다스릴 수 있었습니까?',
        },
        {
          number: 8,
          index: 7,
          text: '최상의 컨디션이라고 얼마나 자주 느끼셨습니까?',
        },
        {
          number: 9,
          index: 8,
          text: '당신이 통제할 수 없는 일 때문에 화가 난 경험이 얼마나 있었습니까?',
        },
        {
          number: 10,
          index: 9,
          text: '어려운 일이 너무 많아서 극복하지 못할 것 같은 느낌을 얼마나 자주 경험하셨습니까?',
        },
      ]}
      onPersist={(scores) => {
        applyInspectionMaleStep7({
          q7: scores[0],
          q8: scores[1],
          q9: scores[2],
          q10: scores[3],
        });
        void syncFemaleInspectionProgressStep(6);
      }}
      onSubmitResult={onSubmitResult}
    />
  );
};

export default InspectionFemaleStep6;
