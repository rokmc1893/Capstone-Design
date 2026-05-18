import { InspectionPssStepPage } from '../components/inspection/InspectionPssStepPage';
import { syncFemaleInspectionProgressStep } from '../lib/testsSessionSync';
import { useSimulatorStore } from '../store/useSimulatorStore';

/** 여성 검사 Step 5/6 (PSS 3~6) */
const InspectionFemaleStep5 = () => {
  const applyInspectionMaleStep6 = useSimulatorStore((s) => s.applyInspectionMaleStep6);

  return (
    <InspectionPssStepPage
      expectedGender="female"
      progressText="5 / 6"
      backPath="/inspection/female/4"
      mode="next"
      nextPath="/inspection/female/6"
      questions={[
        {
          number: 3,
          index: 2,
          text: '신경이 예민해지고 스트레스를 받고 있다는 느낌을 얼마나 경험하셨습니까?',
        },
        {
          number: 4,
          index: 3,
          text: '당신의 개인적 문제들을 다루는 데 있어서 얼마나 자주 자신감을 느꼈습니까?',
        },
        {
          number: 5,
          index: 4,
          text: '당신의 일들이 생각대로 진행되고 있다는 느낌을 얼마나 경험하셨습니까?',
        },
        {
          number: 6,
          index: 5,
          text: '당신이 꼭 해야 하는 일을 처리할 수 없다고 생각한 적이 얼마나 있었습니까?',
        },
      ]}
      onPersist={(scores) => {
        applyInspectionMaleStep6({
          q3: scores[0],
          q4: scores[1],
          q5: scores[2],
          q6: scores[3],
        });
        void syncFemaleInspectionProgressStep(5);
      }}
    />
  );
};

export default InspectionFemaleStep5;
