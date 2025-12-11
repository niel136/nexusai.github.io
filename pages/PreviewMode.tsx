import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Lock, Search, Menu, X, Crown, ArrowRight, Grid, MessageSquare, Image
} from 'lucide-react';
import { INITIAL_FEATURES } from '../constants';
import * as Icons from 'lucide-react';

const PreviewMode: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper para ícones dinâmicos (mesma lógica do Layout)
  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Grid;
    return Icon;
  };

  const handleFeatureClick = () => {
      setShowModal(true);
  };

  const handleSubscribe = () => {
      // Abre checkout Cakto
      window.open("https://app.cakto.com.br/checkout/SEU_LINK_AQUI", '_blank');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans blur-[0.3px] select-none relative">
      
      {/* --- SIDEBAR MOCK --- */}
      <aside className={`fixed md:relative z-30 w-72 h-full bg-white border-r border-slate-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6 opacity-60 pointer-events-none">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-400 flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-slate-700">NexusAI</span>
              <span className="text-xs block text-slate-400">Preview Mode</span>
            </div>
          </div>
          
          <div className="space-y-1">
             {INITIAL_FEATURES.slice(0, 10).map((f) => {
                 const Icon = getIcon(f.icon);
                 return (
                     <div key={f.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400">
                         <Icon size={18} />
                         <span>{f.label}</span>
                         <Lock size={12} className="ml-auto" />
                     </div>
                 )
             })}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT MOCK --- */}
      <div className="flex-1 flex flex-col h-full relative">
         <header className="flex items-center justify-between p-4 md:px-8 bg-white border-b border-slate-200">
             <div className="flex items-center gap-2 md:hidden">
                <Zap size={20} className="text-slate-400" />
                <span className="font-bold text-slate-700">NexusAI</span>
             </div>
             <div className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 mx-auto md:mx-0">
                 <Lock size={16} /> Modo Demonstração (Acesso Restrito)
             </div>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden"><Menu /></button>
         </header>

         <main className="flex-1 p-8 overflow-y-auto bg-slate-50 flex items-center justify-center">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full opacity-75">
                 {/* Dummy Content Cards */}
                 <div onClick={handleFeatureClick} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-200 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[1px]">
                         <Lock className="text-slate-500" />
                     </div>
                     <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 mb-4"><MessageSquare /></div>
                     <h3 className="font-bold mb-2">Chat Inteligente</h3>
                     <p className="text-sm text-slate-500">Converse com a IA mais avançada do mercado.</p>
                 </div>

                 <div onClick={handleFeatureClick} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-200 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[1px]">
                         <Lock className="text-slate-500" />
                     </div>
                     <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 mb-4"><Image /></div>
                     <h3 className="font-bold mb-2">Gerador de Imagens</h3>
                     <p className="text-sm text-slate-500">Crie artes em 4K e estilos únicos.</p>
                 </div>

                 <div onClick={handleFeatureClick} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-green-200 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-[1px]">
                         <Lock className="text-slate-500" />
                     </div>
                     <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-500 mb-4"><Crown /></div>
                     <h3 className="font-bold mb-2">Vídeos Veo</h3>
                     <p className="text-sm text-slate-500">Produção de vídeos cinematográficos.</p>
                 </div>
             </div>
         </main>
      </div>

      {/* --- LOCKED MODAL --- */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-50 text-center shadow-2xl animate-in zoom-in-95">
                  <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                      <X />
                  </button>

                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                      <Lock size={32} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Recurso Bloqueado</h2>
                  <p className="text-slate-600 mb-8">
                      Esta funcionalidade é exclusiva para membros do Plano Pro. Assine para desbloquear o acesso total ao NexusAI.
                  </p>

                  <button 
                    onClick={handleSubscribe}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 mb-4 flex items-center justify-center gap-2"
                  >
                      <Crown size={20} /> Assinar Pro Agora
                  </button>
                  
                  <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center justify-center gap-1 mx-auto">
                      Voltar para Apresentação <ArrowRight size={14} />
                  </button>
              </div>
          </div>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40">
          <button onClick={() => navigate('/')} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
              Sair do Preview
          </button>
      </div>
    </div>
  );
};

export default PreviewMode;