import { InspectionPssStepPage } from '../components/inspection/InspectionPssStepPage';
import { syncFemaleInspectionProgressStep } from '../lib/testsSessionSync';
import { useSimulatorStore } from '../store/useSimulatorStore';

/** 여성 검사 Step 4/6 (PSS 1~2) */
const InspectionFemaleStep4 = () => {
  const applyInspectionMaleStep5 = useSimulatorStore((s) => s.applyInspectionMaleStep5);

  return (
    <InspectionPssStepPage
      expectedGender="female"
      progressText="4 / 6"
      backPath="/inspection/interim-report"
      showIntro
      mode="next"
      nextPath="/inspection/female/5"
      questions={[
        {
          number: 1,
          index: 0,
          text: '예상치 못한 일 때문에 당황한 적이 얼마나 있었습니까?',
        },
        {
          number: 2,
          index: 1,
          text: '인생에서 중요한 일들을 조절할 수 없다는 느낌을 얼마나 경험하셨습니까?',
        },
      ]}
      onPersist={(scores) => {
        applyInspectionMaleStep5({ q1: scores[0], q2: scores[1] });
        void syncFemaleInspectionProgressStep(4);
      }}
    />
  );
};

export default InspectionFemaleStep4;
