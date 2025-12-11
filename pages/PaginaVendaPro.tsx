import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Zap, Crown, ShieldCheck, Image, MessageSquare, 
  Rocket, Eye, Key, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PaginaVendaPro: React.FC = () => {
  const navigate = useNavigate();
  const { activateProDevice } = useApp();
  const [showActivation, setShowActivation] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const pricingRef = useRef<HTMLDivElement>(null);
  
  // LINK EXTERNO DA CAKTO (Apenas no botão do Card de Preço)
  const EXTERNAL_CHECKOUT_URL = "https://app.cakto.com.br/checkout/MEU_CHECKOUT_AQUI";

  // Botões de "Assinar" espalhados pela página agora rolam até o preço
  const handleBuy = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Botão real de compra dentro do card
  const handleCheckout = () => {
    window.open(EXTERNAL_CHECKOUT_URL, '_blank');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleActivate = () => {
    if (activationCode === 'PRO123') { 
        activateProDevice();
        alert("Acesso liberado pelo sistema! Redirecionando para Login Exclusivo.");
        navigate('/login-pro');
    } else {
        alert("Código de ativação inválido.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">NexusAI</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <button 
               onClick={() => setShowActivation(!showActivation)}
               className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-wide px-2 md:px-3 py-2"
             >
               Resgatar
             </button>
             <button 
               onClick={handleBuy}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
             >
               <Crown size={14} /> <span className="hidden md:inline">Assinar</span> Pro
             </button>
          </div>
        </div>
      </nav>

      {/* ACTIVATION MODAL */}
      {showActivation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-blue-100 animate-in zoom-in-95">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <Key size={18} className="text-blue-600" /> Ativar Licença
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                      Simule o webhook. Código: <b>PRO123</b>.
                  </p>
                  <input 
                    type="text" 
                    placeholder="Código..." 
                    className="w-full border border-slate-300 rounded-lg p-3 mb-3 outline-none focus:border-blue-600 bg-slate-50 text-lg"
                    value={activationCode}
                    onChange={e => setActivationCode(e.target.value)}
                  />
                  <button onClick={handleActivate} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-transform">
                      Liberar Acesso
                  </button>
                  <button onClick={() => setShowActivation(false)} className="w-full mt-3 text-slate-400 text-sm hover:text-slate-600">
                      Fechar
                  </button>
              </div>
          </div>
      )}

      {/* HERO SECTION */}
      <header className="pt-28 pb-12 px-4 md:px-6 text-center bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold border border-blue-100 shadow-sm">
            <Crown size={12} className="fill-current" />
            <span>EXCLUSIVO PARA ASSINANTES</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Desbloqueie o Poder <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Ilimitado da IA</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            O NexusAI é uma suíte fechada para profissionais. Gere vídeos, imagens 4K e chat ilimitado.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 pt-4 px-2">
            <button 
              onClick={handleBuy}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-bold py-4 px-10 rounded-2xl md:rounded-full shadow-xl shadow-blue-600/30 transform transition-all hover:-translate-y-1 active:scale-95"
            >
              Assinar Plano Pro
            </button>
            <button 
              onClick={handlePreview}
              className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-10 rounded-2xl md:rounded-full flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Eye size={20} /> Ver Demonstração
            </button>
          </div>

          <div className="pt-4 md:pt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-slate-400">
             <span className="flex items-center gap-1"><ShieldCheck size={14} /> Pagamento Seguro</span>
             <span className="flex items-center gap-1"><Zap size={14} /> Liberação Automática</span>
          </div>
        </div>
      </header>

      {/* RECURSOS / BENEFÍCIOS */}
      <section className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
           <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                 <Image size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-slate-900">Imagens Ultra HD</h3>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                 Gere visuais em 4K sem marca d'água. Exclusivo Pro.
              </p>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                 <MessageSquare size={24} className="text-violet-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-slate-900">Chat Sem Limites</h3>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                 Acesso 24/7 aos modelos mais avançados sem filas.
              </p>
           </div>
           <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                 <Rocket size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-slate-900">Ferramentas Veo</h3>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                 Criação de vídeos cinematográficos e apps.
              </p>
           </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Comparativo</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">Por que o Pro é essencial.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-sm md:text-base">
             <div className="grid grid-cols-3 bg-slate-100/50 p-4 md:p-6 border-b border-slate-100 font-bold text-slate-900">
                <div>Recurso</div>
                <div className="text-center text-slate-400">Visitante</div>
                <div className="text-center text-blue-600">ASSINANTE</div>
             </div>
             <div className="divide-y divide-slate-100">
                {[
                   { name: "Acesso App", free: "Bloqueado", pro: "Liberado" },
                   { name: "Vídeos IA", free: "-", pro: "Ilimitado" },
                   { name: "Modelos", free: "-", pro: "Pro & Ultra" },
                   { name: "Qualidade", free: "-", pro: "4K / HD" },
                ].map((row, i) => (
                   <div key={i} className="grid grid-cols-3 p-4 md:p-5 items-center hover:bg-slate-50/50 transition-colors">
                      <div className="font-medium text-slate-700 truncate pr-2">{row.name}</div>
                      <div className="text-center text-slate-400 text-xs md:text-base">{row.free}</div>
                      <div className="text-center font-bold text-blue-600 flex justify-center items-center gap-1 md:gap-2 text-xs md:text-base">
                         <Check size={14} className="md:w-[18px] md:h-[18px]" /> {row.pro}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* PRICING CARD SECTION (Novo) */}
      <section ref={pricingRef} className="py-20 px-4 md:px-6 bg-white">
        <div className="max-w-md mx-auto relative z-10">
          {/* Card Container */}
          <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
             
             {/* Tag Superior */}
             <div className="bg-blue-600 text-white text-center py-3 text-xs md:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                <Star size={14} fill="currentColor" /> MELHOR CUSTO–BENEFÍCIO
             </div>

             <div className="p-8 md:p-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2">NexusAI PRO</h3>
                <p className="text-slate-500 mb-8">O plano definitivo para criadores.</p>

                {/* Preço */}
                <div className="flex items-end justify-center gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">R$ 29,90</span>
                  <span className="text-lg text-slate-400 font-medium mb-1">/mês</span>
                </div>

                {/* Lista de Benefícios */}
                <ul className="space-y-4 text-left w-full mb-10">
                   {[
                     "Acesso Ilimitado ao Chat IA",
                     "Gerador de Imagens 4K",
                     "Criação de Vídeos (Veo)",
                     "Ferramentas de Marketing",
                     "Acesso Antecipado a Recursos",
                     "Suporte VIP Prioritário"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-sm md:text-base">
                       <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                         <Check size={14} strokeWidth={3} />
                       </div>
                       {item}
                     </li>
                   ))}
                </ul>

                {/* Botão de Checkout (Verde Fluorescente) */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-extrabold py-5 rounded-2xl text-lg shadow-xl shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mb-4"
                >
                  Garantir Acesso por R$ 29,90
                </button>

                <p className="text-xs text-slate-400">
                  Compra segura via Cakto. Cancele quando quiser.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 py-8 md:py-12 px-6 border-t border-slate-200 text-center">
         <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-slate-900 rounded flex items-center justify-center text-white">
               <Zap size={12} fill="currentColor" />
            </div>
            <span className="font-bold text-slate-900 text-sm md:text-base">NexusAI</span>
         </div>
         <p className="text-slate-500 text-xs md:text-sm">Pagamento processado seguramente via Cakto.</p>
      </footer>

    </div>
  );
};

export default PaginaVendaPro;