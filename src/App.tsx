import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import DocsLayout from './components/DocsLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreateSurvey from './pages/CreateSurvey';
import TakeSurvey from './pages/TakeSurvey';
import Dashboard from './pages/Dashboard';
import Credits from './pages/Credits';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import EditSurvey from './pages/EditSurvey';
import Landing from './pages/Landing';
import GettingStarted from './pages/docs/GettingStarted';
import CreatingSurveys from './pages/docs/CreatingSurveys';
import BrowsingResponding from './pages/docs/BrowsingResponding';
import CreditsSystem from './pages/docs/CreditsSystem';
import AnalyticsDashboard from './pages/docs/AnalyticsDashboard';
import ProfileSetup from './pages/docs/ProfileSetup';
import api from './lib/api';

const queryClient = new QueryClient();

export default function App() {
  const { user, token, logout, updateCredits } = useAuthStore();

  useEffect(() => {
    if (token) {
      // Refresh user data (credits) on load
      api.get('/users/me').then(res => {
        updateCredits(res.data.creditBalance);
      }).catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      });
    }
  }, [token, logout, updateCredits]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <div className="min-h-screen w-full overflow-x-clip bg-stone-50 flex flex-col font-sans text-stone-900">
          <Navbar />
          <main className="grow flex flex-col">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <div className="grow flex items-center justify-center py-12"><Login /></div>} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <div className="grow flex items-center justify-center py-12"><Register /></div>} />

              <Route path="/docs" element={<DocsLayout />}>
                <Route index element={<Navigate to="/docs/getting-started" replace />} />
                <Route path="getting-started" element={<GettingStarted />} />
                <Route path="creating-surveys" element={<CreatingSurveys />} />
                <Route path="browsing-responding" element={<BrowsingResponding />} />
                <Route path="credits" element={<CreditsSystem />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="profile" element={<ProfileSetup />} />
              </Route>

              <Route path="/" element={user ? <Feed /> : <Landing />} />
              <Route path="/create" element={user ? <CreateSurvey /> : <Navigate to="/login" />} />
              <Route path="/survey/:id" element={user ? <TakeSurvey /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/credits" element={user ? <Credits /> : <Navigate to="/login" />} />
              <Route path="/survey/:id/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/survey/:id/edit" element={user ? <EditSurvey /> : <Navigate to="/login" />} />
            </Routes>
          </main>
          
          {user && (
            <footer className="bg-white border-t border-stone-200 py-8 mt-auto shrink-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  &copy; 2026 SurveyExchange Ghana • Digital Research Ecosystem
                </p>
              </div>
            </footer>
          )}
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
