import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDashboard } from './pages/Admin';
import { DynamicTool } from './pages/DynamicTool';
import Profile from './pages/Profile';
import PaginaVendaPro from './pages/PaginaVendaPro';
import PreviewMode from './pages/PreviewMode';
import LoginPro from './pages/LoginPro';

// Lazy loading existing pages
const Chat = lazy(() => import('./pages/Chat'));
const ImageGen = lazy(() => import('./pages/ImageGen'));
const VideoGen = lazy(() => import('./pages/VideoGen'));
const Upgrade = lazy(() => import('./pages/Upgrade'));

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-white text-blue-600">
    <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full"></div>
  </div>
);

// Rota Protegida REAL: Verifica Auth + Ativação do Device
const ProtectedRoute = () => {
  const { isAuthenticated, isProActivated } = useApp();
  
  // 1. Se o device não foi ativado (Webhook), vai pra vendas
  if (!isProActivated) return <Navigate to="/" replace />;

  // 2. Se ativado mas não logado, vai pro Login Pro
  if (!isAuthenticated) return <Navigate to="/login-pro" replace />;

  // 3. Tudo certo
  return <Layout><Outlet /></Layout>;
};

const AdminRoute = () => {
  const { user } = useApp();
  return user?.role === 'admin' ? <Layout><Outlet /></Layout> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <HashRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* ROTA PÚBLICA 1: Landing Page (Entrada Padrão) */}
                <Route path="/" element={<PaginaVendaPro />} />
                
                {/* ROTA PÚBLICA 2: Modo Preview (Demo Limitada) */}
                <Route path="/preview" element={<PreviewMode />} />

                {/* ROTA PÚBLICA 3: Login (Apenas se ativado) */}
                <Route path="/login-pro" element={<LoginPro />} />

                {/* --- ROTAS BLOQUEADAS (Apenas Assinantes) --- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/pro" element={<Navigate to="/" replace />} /> {/* Redireciona antigo pro */}
                  
                  <Route path="/tool/chat" element={<Chat />} />
                  <Route path="/tool/image" element={<ImageGen />} />
                  <Route path="/tool/video" element={<VideoGen />} />
                  <Route path="/tool/:id" element={<DynamicTool />} />
                  
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;