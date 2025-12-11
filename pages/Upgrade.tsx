import React, { useState } from 'react';
import { Check, Zap, Crown, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

const Upgrade: React.FC = () => {
  const { user, upgradeToPro } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [mockTxId, setMockTxId] = useState('');

  const handleVerifyPayment = () => {
      // Simulate Cakto Webhook verification
      if (mockTxId.length > 5) {
          setTimeout(() => {
            upgradeToPro();
            alert("Pagamento Verificado! Bem-vindo ao Pro.");
            setShowPayment(false);
          }, 1500);
      } else {
          alert("ID de Transação Inválido");
      }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-main mb-4">Desbloqueie o Núcleo</h1>
        <p className="text-text-muted">Escolha o nível de poder ideal para suas necessidades criativas.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="glass-panel p-8 rounded-3xl border-border relative overflow-hidden">
          <h3 className="text-2xl font-bold text-text-main mb-2">Iniciado</h3>
          <div className="text-4xl font-bold text-text-main mb-6">R$0<span className="text-lg text-text-muted font-normal">/mês</span></div>
          <ul className="space-y-4 mb-8 text-text-muted">
            <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> 5 Créditos / Dia</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Geração Padrão</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Acesso ao Chat</li>
          </ul>
          <Button variant="secondary" className="w-full" disabled={user.plan === 'free'}>
            {user.plan === 'free' ? 'Plano Atual' : 'Downgrade'}
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel p-8 rounded-3xl border-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          
          <h3 className="text-2xl font-bold text-text-main mb-2 flex items-center gap-2">
            <Crown className="text-amber-500" fill="currentColor" /> Nexus Pro
          </h3>
          <div className="text-4xl font-bold text-text-main mb-6">R$29<span className="text-lg text-text-muted font-normal">/mês</span></div>
          
          <ul className="space-y-4 mb-8 text-text-main">
            <li className="flex items-center gap-3"><Check size={18} className="text-primary" /> 100 Créditos / Dia</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-primary" /> Upscale de Imagem 2K</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-primary" /> Geração de Vídeo Veo</li>
            <li className="flex items-center gap-3"><Check size={18} className="text-primary" /> Suporte Prioritário</li>
          </ul>

          {user.plan === 'pro' ? (
              <Button className="w-full bg-green-500/20 text-green-500 border-green-500/50" disabled>Ativo</Button>
          ) : (
              <Button glow className="w-full" onClick={() => setShowPayment(true)}>Assinar Agora</Button>
          )}
        </div>
      </div>

      {/* Payment Modal (Cakto Mock) */}
      {showPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full relative">
                  <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><Zap size={20} className="rotate-45" /></button>
                  
                  <h3 className="text-xl font-bold text-white mb-4">Pagar via Pix (Cakto)</h3>
                  
                  <div className="bg-white p-4 rounded-xl mb-4 flex flex-col items-center">
                     {/* QR Code Placeholder */}
                     <div className="w-48 h-48 bg-slate-200 flex items-center justify-center mb-2">
                         <span className="text-black font-mono text-xs">QR CODE MOCKUP</span>
                     </div>
                     <p className="text-slate-900 font-mono text-sm break-all text-center">
                         00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000
                     </p>
                     <button className="text-violet-600 text-sm mt-2 flex items-center gap-1 font-bold">
                         <Copy size={12} /> Copiar Código
                     </button>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm text-slate-400">Simular Webhook (Cole qualquer ID)</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white"
                        placeholder="ID da Transação (ex: tx_12345)"
                        value={mockTxId}
                        onChange={(e) => setMockTxId(e.target.value)}
                      />
                      <Button onClick={handleVerifyPayment} className="w-full mt-2">Confirmar Pagamento</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Upgrade;