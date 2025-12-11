import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Zap, Lock, User, AlertTriangle } from 'lucide-react';

const LoginPro: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, isProActivated } = useApp();
  const navigate = useNavigate();

  // Se não estiver ativado via webhook (localStorage), chuta de volta pra vendas
  useEffect(() => {
    if (!isProActivated) {
        navigate('/');
    }
    if (user) {
        navigate('/tool/chat');
    }
  }, [user, isProActivated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) navigate('/tool/chat');
    } catch (err) {
      setError("Acesso negado. Verifique suas credenciais de assinante.");
    }
  };

  if (!isProActivated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <Zap className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Área do Assinante</h1>
          <p className="text-slate-500">Entre com sua conta Pro</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-red-100">
                <AlertTriangle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Usuário Pro</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        required
                        className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-600 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none transition-all"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Senha de Acesso</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        required
                        className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-blue-600 rounded-xl py-3 pl-10 pr-4 text-slate-900 outline-none transition-all"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>
            
            <Button type="submit" className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
                Acessar Núcleo
            </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400">
                Problemas de acesso? Contate o suporte Cakto.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPro;