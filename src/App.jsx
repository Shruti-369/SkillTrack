import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarLayout } from './components/layout/SidebarLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddSkillPage } from './pages/AddSkillPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { CommunityPage } from './pages/CommunityPage';
import { MessagesPage } from './pages/MessagesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

import { SkillProvider } from './lib/SkillContext';
import { AppProvider } from './lib/AppContext';

function App() {
  return (
    <AppProvider>
      <SkillProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/skills/add" element={<AddSkillPage />} />
              <Route path="/skills/:id" element={<SkillDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </SkillProvider>
    </AppProvider>
  );
}

export default App;
