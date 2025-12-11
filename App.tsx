import React, { Suspense, lazy } from 'react';
import { HashRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
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
  const history = useHistory();

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
        onClick={() => history.push('/landing')}
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

// Extracted component to use hooks inside AppProvider context
const RouteRender: React.FC = () => {
  const { isAuthenticated, isProActivated, user } = useApp();

  return (
    <Switch>
      {/* ROTA PADRÃO SIMPLES */}
      <Route exact path="/" component={SimpleHome} />
      
      {/* Landing Page */}
      <Route path="/landing" component={PaginaVendaPro} />
      
      {/* Rotas Públicas */}
      <Route path="/preview" component={PreviewMode} />
      <Route path="/login-pro" component={LoginPro} />

      {/* Admin Route */}
      <Route path="/admin" render={() => (
        user?.role === 'admin' ? (
          <Layout>
            <Switch>
              <Route path="/admin/dashboard" component={AdminDashboard} />
            </Switch>
          </Layout>
        ) : <Redirect to="/" />
      )} />

      {/* --- ROTAS BLOQUEADAS (Apenas Assinantes) --- */}
      <Route path={["/pro", "/tool/:id", "/profile", "/upgrade"]} render={() => (
        isProActivated && isAuthenticated ? (
          <Layout>
             <Switch>
                <Route path="/pro" render={() => <Redirect to="/landing" />} />
                <Route path="/tool/chat" component={Chat} />
                <Route path="/tool/image" component={ImageGen} />
                <Route path="/tool/video" component={VideoGen} />
                <Route path="/tool/:id" component={DynamicTool} />
                <Route path="/profile" component={Profile} />
                <Route path="/upgrade" component={Upgrade} />
             </Switch>
          </Layout>
        ) : <Redirect to={!isProActivated ? "/landing" : "/login-pro"} />
      )} />

      {/* Fallback */}
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default App;