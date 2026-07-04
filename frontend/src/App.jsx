import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import AdminLayout from './layouts/AdminLayout';

// Citizen Pages
import CitizenHome from './pages/CitizenHome';
import CitizenTrack from './pages/CitizenTrack';
import CitizenSubmit from './pages/CitizenSubmit';
import CitizenUpdates from './pages/CitizenUpdates';
import CitizenProfile from './pages/CitizenProfile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminGrievances from './pages/AdminGrievances';
import AdminConstituents from './pages/AdminConstituents';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Mobile Citizen View ── */}
        <Route element={<CitizenLayout />}>
          <Route path="/" element={<CitizenHome />} />
          <Route path="/track" element={<CitizenTrack />} />
          <Route path="/submit" element={<CitizenSubmit />} />
          <Route path="/updates" element={<CitizenUpdates />} />
          <Route path="/profile" element={<CitizenProfile />} />
        </Route>

        {/* ── Desktop Admin Dashboard ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="grievances" element={<AdminGrievances />} />
          <Route path="constituents" element={<AdminConstituents />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
