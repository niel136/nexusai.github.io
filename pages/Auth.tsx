import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Zap, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [recoverySent, setRecoverySent] = useState(false);

  const { login, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      if (success) navigate('/');
    } catch (err) {
      setError("Credenciais inválidas ou usuário não encontrado.");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
          setError("Digite seu e-mail para recuperar.");
          return;
      }
      setRecoverySent(true);
      setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-3xl p-8 shadow-soft">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Zap className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-main">
              {view === 'login' ? 'Bem-vindo de volta' : 'Recuperar Senha'}
          </h1>
          <p className="text-text-muted">
              {view === 'login' ? 'Entre para continuar criando' : 'Enviaremos um link para você'}
          </p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        {recoverySent && view === 'forgot' && (
            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg mb-4 text-sm text-center">
                Link de recuperação enviado para <b>{email}</b> (Simulado).
            </div>
        )}

        {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase">E-mail ou Usuário</label>
                <div className="relative">
                <User className="absolute left-3 top-3 text-text-muted" size={18} />
                <input 
                    type="text" 
                    required
                    className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com ou administrador"
                />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted uppercase">Senha</label>
                <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-muted" size={18} />
                <input 
                    type="password" 
                    required
                    className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
                </div>
                <div className="text-right">
                    <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="text-xs text-primary hover:underline">Esqueceu a senha?</button>
                </div>
            </div>
            
            <Button type="submit" className="w-full mt-4">Entrar</Button>
            </form>
        ) : (
            <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase">E-mail de Cadastro</label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-3 text-text-muted" size={18} />
                    <input 
                        type="email" 
                        required
                        className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                    />
                    </div>
                </div>
                <Button type="submit" className="w-full mt-4" disabled={recoverySent}>Enviar Link</Button>
                <button type="button" onClick={() => { setView('login'); setRecoverySent(false); setError(''); }} className="w-full text-center text-sm text-text-muted hover:text-text-main flex items-center justify-center gap-1 mt-4">
                    <ArrowLeft size={14} /> Voltar para o Login
                </button>
            </form>
        )}

        {view === 'login' && (
            <p className="text-center mt-6 text-sm text-text-muted">
            Não tem conta? <Link to="/signup" className="text-primary font-bold hover:underline">Criar conta</Link>
            </p>
        )}
        
        <div className="mt-8 pt-4 border-t border-border flex justify-center gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-primary">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-primary">Política de Privacidade</a>
        </div>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { signup, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        navigate('/');
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.name.trim()) return setError("Nome é obrigatório.");
    if (!formData.email.includes('@')) return setError("E-mail inválido.");
    if (formData.password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    
    try {
      await signup(formData);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-md bg-bg-card border border-border rounded-3xl p-8 shadow-soft">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-main">Criar Conta</h1>
          <p className="text-text-muted">Comece sua jornada com IA</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
               <User className="absolute left-3 top-3 text-text-muted" size={18} />
               <input 
                 type="text" required placeholder="Nome Completo"
                 className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main outline-none focus:border-primary"
                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
               />
          </div>
          <div className="relative">
               <Mail className="absolute left-3 top-3 text-text-muted" size={18} />
               <input 
                 type="email" required placeholder="E-mail"
                 className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main outline-none focus:border-primary"
                 value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
               />
          </div>
          <div className="relative">
               <Phone className="absolute left-3 top-3 text-text-muted" size={18} />
               <input 
                 type="tel" required placeholder="Telefone"
                 className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main outline-none focus:border-primary"
                 value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
               />
          </div>
          <div className="relative">
               <Lock className="absolute left-3 top-3 text-text-muted" size={18} />
               <input 
                 type="password" required placeholder="Senha (Min 6 caracteres)"
                 className="w-full bg-bg-input border border-border rounded-xl py-3 pl-10 pr-4 text-text-main outline-none focus:border-primary"
                 value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
               />
          </div>
          
          <Button type="submit" className="w-full mt-4">Cadastrar e Entrar <ArrowRight size={16} /></Button>
        </form>

        <p className="text-center mt-6 text-sm text-text-muted">
           Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Fazer login</Link>
        </p>

        <div className="mt-8 pt-4 border-t border-border flex justify-center gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-primary">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-primary">Política de Privacidade</a>
        </div>
      </div>
    </div>
  );
};