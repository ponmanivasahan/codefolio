import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import CustomCursor from './components/CustomCursor.jsx';

// Layouts
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Public pages
import Landing from './pages/Landing.jsx';
import Pricing from './pages/Pricing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import PublicPortfolio from './pages/PublicPortfolio.jsx';

// Dashboard pages
import Overview from './pages/dashboard/Overview.jsx';
import ProfilePage from './pages/dashboard/ProfilePage.jsx';
import ProjectsPage from './pages/dashboard/ProjectsPage.jsx';
import SkillsPage from './pages/dashboard/SkillsPage.jsx';
import SocialLinksPage from './pages/dashboard/SocialLinksPage.jsx';
import DesignPage from './pages/dashboard/DesignPage.jsx';
import AnalyticsPage from './pages/dashboard/AnalyticsPage.jsx';
import MessagesPage from './pages/dashboard/MessagesPage.jsx';
import DomainPage from './pages/dashboard/DomainPage.jsx';
import SettingsPage from './pages/dashboard/SettingsPage.jsx';
import Onboarding from './pages/Onboarding.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <CustomCursor />
      <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="social-links" element={<SocialLinksPage />} />
        <Route path="design" element={<DesignPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="domain" element={<DomainPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Public portfolios - must be last */}
      <Route path="/:username" element={<PublicPortfolio />} />
    </Routes>
    </>
  );
}
