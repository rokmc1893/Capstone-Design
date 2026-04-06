import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailAuth from './pages/EmailAuth';
import KakaoCallback from './pages/KakaoCallback';
import Splash from './pages/Splash';
import Onboarding2 from './pages/Onboarding2';
import Settings from './pages/Settings';
import NotificationSettings from './pages/NotificationSettings';
import Simulator from './pages/Simulator';
import Community from './pages/Community';
import Missions from './pages/Missions';
import MissionsArchive from './pages/MissionsArchive';
import InspectionGender from './pages/InspectionGender';
import InspectionFemaleStep1 from './pages/InspectionFemaleStep1';
import InspectionFemaleStep2 from './pages/InspectionFemaleStep2';
import InspectionFemaleStep3 from './pages/InspectionFemaleStep3';
import InspectionFemaleStep4 from './pages/InspectionFemaleStep4';
import InspectionMaleStep1 from './pages/InspectionMaleStep1';
import InspectionMaleStep2 from './pages/InspectionMaleStep2';
import InspectionMaleStep3 from './pages/InspectionMaleStep3';
import InspectionMaleStep4 from './pages/InspectionMaleStep4';
import InspectionMaleStep5 from './pages/InspectionMaleStep5';
import InspectionMaleStep6 from './pages/InspectionMaleStep6';
import InspectionMaleStep7 from './pages/InspectionMaleStep7';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding/2" element={<Onboarding2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/community" element={<Community />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inspection" element={<InspectionGender />} />
        <Route path="/inspection/female/1" element={<InspectionFemaleStep1 />} />
        <Route path="/inspection/female/2" element={<InspectionFemaleStep2 />} />
        <Route path="/inspection/female/3" element={<InspectionFemaleStep3 />} />
        <Route path="/inspection/female/4" element={<InspectionFemaleStep4 />} />
        <Route path="/inspection/male/1" element={<InspectionMaleStep1 />} />
        <Route path="/inspection/male/2" element={<InspectionMaleStep2 />} />
        <Route path="/inspection/male/3" element={<InspectionMaleStep3 />} />
        <Route path="/inspection/male/4" element={<InspectionMaleStep4 />} />
        <Route path="/inspection/male/5" element={<InspectionMaleStep5 />} />
        <Route path="/inspection/male/6" element={<InspectionMaleStep6 />} />
        <Route path="/inspection/male/7" element={<InspectionMaleStep7 />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/archive" element={<MissionsArchive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </Router>
  );
}

export default App;