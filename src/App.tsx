import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import PublicProfilesPage from './pages/PublicProfilesPage';
import PublicProfileDetailPage from './pages/PublicProfileDetailPage';
import { syncDbWithRemote } from './lib/db';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'farmer': return <FarmerDashboard />;
    case 'seller': return <SellerDashboard />;
    case 'owner': return <OwnerDashboard />;
    case 'admin': return <AdminDashboard />;
    default: return <Navigate to="/" />;
  }
};

const App: React.FC = () => {
  const [dbReady, setDbReady] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    void syncDbWithRemote().finally(() => {
      if (mounted) setDbReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!dbReady) return null;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/profils" element={<PublicProfilesPage />} />
          <Route path="/profils/:id" element={<PublicProfileDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
