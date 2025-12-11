import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminDashboard } from './pages/Admin';
import { DynamicTool } from './pages/DynamicTool';
import Profile from './pages/Profile';
import PreviewMode from './pages/PreviewMode';
import LoginPro from './pages/LoginPro';
import { Zap, ArrowRight } from 'lucide-react';

// Lazy loading existing pages
const Chat = lazy(() => import('./pages/Chat'));
const ImageGen = lazy(() => import('./pages/ImageGen'));
const VideoGen = lazy(() => import('./pages/VideoGen'));
const Upgrade = lazy(() => import('./pages/Upgrade'));
const PaginaVendaPro = lazy(() => import('./pages/PaginaVendaPro'));

// --- COMPONENTE SIMPLES PARA GARANTIR RENDERIZAÇÃO NA VERCEL ---
const SimpleHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-6">
        <Zap className="text-white w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">NexusAI Studio</h1>
      <p className="text-slate-500 max-w-md mb-8">
        Aplicação ativa e rodando. Clique abaixo para acessar a página de apresentação completa.
      </p>
      <button 
        onClick={() => navigate('/landing')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
      >
        Entrar no Sistema <ArrowRight size={18} />
      </button>
      <p className="mt-8 text-xs text-slate-400">Vercel Deployment Status: Active</p>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-50 text-blue-600">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <span className="text-sm font-medium">Carregando módulos...</span>
    </div>
  </div>
);

// Wrapper for protected routes
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isProActivated } = useApp();
  
  if (!isProActivated) return <Navigate to="/landing" replace />;
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
      {/* ROTA PADRÃO SIMPLES */}
      <Route path="/" element={<SimpleHome />} />
      
      {/* Landing Page */}
      <Route path="/landing" element={<PaginaVendaPro />} />
      
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
         <Route path="/pro" element={<Navigate to="/landing" replace />} />
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