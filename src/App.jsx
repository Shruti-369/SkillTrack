import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarLayout } from './components/layout/SidebarLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddSkillPage } from './pages/AddSkillPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/skills/add" element={<AddSkillPage />} />
          <Route path="/skills/:id" element={<SkillDetailPage />} />
          <Route path="/settings" element={<div className="p-8">Settings</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
