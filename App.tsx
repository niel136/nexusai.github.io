import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDashboard } from './pages/Admin';
import { DynamicTool } from './pages/DynamicTool';
import Profile from './pages/Profile';
import PreviewMode from './pages/PreviewMode';
import LoginPro from './pages/LoginPro';

// Lazy loading existing pages
const Chat = lazy(() => import('./pages/Chat'));
const ImageGen = lazy(() => import('./pages/ImageGen'));
const VideoGen = lazy(() => import('./pages/VideoGen'));
const Upgrade = lazy(() => import('./pages/Upgrade'));
const PaginaVendaPro = lazy(() => import('./pages/PaginaVendaPro'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50 text-blue-600">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <span className="text-sm font-medium">Carregando sistema...</span>
    </div>
  </div>
);

// Wrapper for protected routes
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isProActivated } = useApp();
  
  if (!isProActivated) return <Navigate to="/" replace />;
  if (!isAuthenticated) return <Navigate to="/login-pro" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <HashRouter>
            <Suspense fallback={<LoadingFallback />}>
              <RouteRender />
            </Suspense>
          </HashRouter>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

const RouteRender: React.FC = () => {
  const { user } = useApp();

  return (
    <Routes>
      {/* Landing Page como Home Padrão */}
      <Route path="/" element={<PaginaVendaPro />} />
      
      {/* Rotas Públicas */}
      <Route path="/preview" element={<PreviewMode />} />
      <Route path="/login-pro" element={<LoginPro />} />

      {/* Admin Route */}
      <Route path="/admin/dashboard" element={
        user?.role === 'admin' ? (
          <Layout>
            <AdminDashboard />
          </Layout>
        ) : <Navigate to="/" replace />
      } />

      {/* --- ROTAS BLOQUEADAS (Apenas Assinantes) --- */}
      <Route element={<ProtectedLayout />}>
         <Route path="/pro" element={<Navigate to="/" replace />} />
         <Route path="/tool/chat" element={<Chat />} />
         <Route path="/tool/image" element={<ImageGen />} />
         <Route path="/tool/video" element={<VideoGen />} />
         <Route path="/tool/:id" element={<DynamicTool />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/upgrade" element={<Upgrade />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;