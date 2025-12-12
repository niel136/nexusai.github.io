import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ExternalLink, Zap, Lock, LayoutTemplate } from 'lucide-react';

const Sitemap: React.FC = () => {
  const routes = [
    { path: '/lp-video', label: 'Landing Page (Produção)', icon: LayoutTemplate, desc: 'Página de vendas principal.' },
    { path: '/login-pro', label: 'Login do Assinante', icon: Lock, desc: 'Área de login exclusivo.' },
    { path: '/preview', label: 'Modo Preview', icon: ExternalLink, desc: 'Demonstração limitada do app.' },
    { path: '/tool/chat', label: 'App (Rota Protegida)', icon: Zap, desc: 'Requer autenticação.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Map size={24} />
            </div>
            <h1 className="text-2xl font-bold">Mapa de Desenvolvimento</h1>
          </div>
          <p className="text-blue-100 text-sm">
            Você está em um ambiente de Preview. O roteamento foi ajustado para <b>HashRouter</b> para evitar erros de proxy.
          </p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {routes.map((route) => (
              <Link 
                key={route.path} 
                to={route.path}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <route.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {route.label}
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      {route.path}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{route.desc}</p>
                </div>
                <div className="text-slate-300 group-hover:text-blue-600">
                  <ExternalLink size={18} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              NexusAI Studio • Developer Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;