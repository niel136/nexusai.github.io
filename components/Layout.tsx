import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Zap, LogOut, ShieldAlert, Search, UserCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SearchOverlay } from './SearchOverlay';
import * as Icons from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout, features } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login-pro');
  };

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.Grid;
    return Icon;
  };

  return (
    <div className="flex h-screen bg-bg-main text-text-main overflow-hidden font-sans transition-colors duration-300">
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Sidebar Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-72 h-full bg-bg-card border-r border-border transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <Zap className="text-white" size={24} />
                </div>
                <div>
                <span className="text-2xl font-bold tracking-tight text-primary">NexusAI</span>
                <span className="text-xs block text-text-muted">Studio Pro</span>
                </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-text-muted">
                <X size={24} />
            </button>
          </div>

          <div className="mb-6">
             <div className="bg-bg-input p-4 rounded-xl flex items-center gap-3 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                   {user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium truncate">{user?.name}</p>
                   <p className="text-xs text-text-muted flex items-center gap-1">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                   </p>
                </div>
             </div>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2 pb-4">
            {user?.role === 'admin' && (
              <div className="mb-4">
                 <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Admin</p>
                 <Link 
                    to="/admin/dashboard" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname.includes('/admin') ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-bg-input'}`}
                 >
                    <ShieldAlert size={18} /> Painel Admin
                 </Link>
              </div>
            )}

            <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 mt-4">Ferramentas</p>
            {features.filter(f => f.enabled).map((feature) => {
              const Icon = getIcon(feature.icon);
              const isActive = location.pathname === feature.path;
              return (
                <Link
                  key={feature.id}
                  to={feature.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    isActive 
                      ? 'bg-primary text-white shadow-soft' 
                      : 'text-text-muted hover:bg-bg-input hover:text-text-main'
                  }`}
                >
                  <Icon size={18} />
                  <span>{feature.label}</span>
                  
                  {feature.id === 'learn-ai' && (
                    <span className="absolute right-2 bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      NOVO
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-border space-y-1">
             <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-bg-input">
                <UserCircle size={18} /> Meu Perfil
             </Link>
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut size={18} /> Sair
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:px-8 bg-bg-card/80 backdrop-blur border-b border-border sticky top-0 z-30 h-16">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-text-main p-1 -ml-1 active:bg-bg-input rounded-lg">
               <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                <span className="font-bold text-text-main">NexusAI</span>
            </div>
          </div>

          <div className="hidden md:block text-sm text-text-muted font-medium">
             Transforme ideias em realidade.
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={() => setSearchOpen(true)}
               className="p-2.5 rounded-full bg-bg-input text-text-muted hover:bg-primary/10 hover:text-primary transition-colors active:scale-95"
             >
                <Search size={20} />
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-main scroll-smooth">
           <div className="max-w-6xl mx-auto h-full">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;