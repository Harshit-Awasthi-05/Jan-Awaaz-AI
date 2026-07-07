import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import CitizenLayout from './layouts/CitizenLayout';
import AdminLayout from './layouts/AdminLayout';
import CitizenLogin from './pages/CitizenLogin';
import MPLogin from './pages/MPLogin';
import CitizenHome from './pages/CitizenHome';
import CitizenTrack from './pages/CitizenTrack';
import CitizenSubmit from './pages/CitizenSubmit';
import CitizenUpdates from './pages/CitizenUpdates';
import CitizenProfile from './pages/CitizenProfile';
import CitizenNotifications from './pages/CitizenNotifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminGrievances from './pages/AdminGrievances';
import AdminConstituents from './pages/AdminConstituents';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';

function RequireCitizen({ children }) {
  const { citizenUser, citizenLoading } = useAuth();
  if (citizenLoading) return <div className="p-6 text-sm text-[#64748B]">Loading...</div>;
  if (!citizenUser) return <Navigate to="/login" replace />;
  return children;
}

function RequireMP({ children }) {
  const { mpToken, citizenUser } = useAuth();
  if (citizenUser) return <Navigate to="/" replace />; // Block active citizens
  if (!mpToken) return <Navigate to="/admin/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<CitizenLogin />} />
      <Route path="/admin/login" element={<MPLogin />} />

      
      <Route
        element={
          <RequireCitizen>
            <CitizenLayout />
          </RequireCitizen>
        }
      >
        <Route path="/" element={<CitizenHome />} />
        <Route path="/track" element={<CitizenTrack />} />
        <Route path="/submit" element={<CitizenSubmit />} />
        <Route path="/updates" element={<CitizenUpdates />} />
        <Route path="/profile" element={<CitizenProfile />} />
        <Route path="/notifications" element={<CitizenNotifications />} />
      </Route>

    
      <Route
        path="/admin"
        element={
          <RequireMP>
            <AdminLayout />
          </RequireMP>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="grievances" element={<AdminGrievances />} />
        <Route path="constituents" element={<AdminConstituents />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}