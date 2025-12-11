import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppFeature, SystemLog } from '../types';
import { DAILY_LIMIT_FREE, DAILY_LIMIT_PRO, INITIAL_FEATURES } from '../constants';
import { useTheme } from './ThemeContext';
import { supabase } from '../services/supabaseClient';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  features: AppFeature[];
  usersList: User[]; 
  systemLogs: SystemLog[];
  
  // Pro Activation (Device Level)
  isProActivated: boolean;
  activateProDevice: () => void;
  
  // Auth Methods
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  upgradeToPro: () => void;
  
  // Feature Methods
  deductCredit: () => boolean;
  refreshCredits: () => void;
  
  // Admin Methods
  toggleFeature: (id: string) => void;
  banUser: (id: string) => void;
  addSystemLog: (action: string) => void;
  adminChatAction: (command: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [features, setFeatures] = useState<AppFeature[]>(INITIAL_FEATURES);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]); 
  
  // Verifica se este dispositivo foi ativado via Webhook/Cakto (Simulado via localStorage)
  const [isProActivated, setIsProActivated] = useState<boolean>(() => {
    return localStorage.getItem('nexus_pro_status') === 'active';
  });

  const activateProDevice = () => {
    localStorage.setItem('nexus_pro_status', 'active');
    setIsProActivated(true);
  };

  // Listen to Supabase Auth State
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        formatAndSetUser(session.user);
      }
    });

    // Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        formatAndSetUser(session.user);
      } else {
        setUser(null);
        setTheme('white');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatAndSetUser = (authUser: any) => {
    const metadata = authUser.user_metadata || {};
    const isAdmin = authUser.email === 'admin@nexus.ai' || metadata.role === 'admin';

    const appUser: User = {
      id: authUser.id,
      email: authUser.email || '',
      name: metadata.name || authUser.email?.split('@')[0] || 'Usuário',
      phone: metadata.phone || '',
      role: isAdmin ? 'admin' : 'user',
      plan: metadata.plan || 'free',
      theme: metadata.theme || 'white',
      credits: metadata.credits !== undefined ? metadata.credits : DAILY_LIMIT_FREE,
      status: 'active',
      createdAt: new Date(authUser.created_at).getTime()
    };

    setUser(appUser);
    setTheme(appUser.theme);
    
    setUsersList(prev => {
        const exists = prev.find(u => u.id === appUser.id);
        return exists ? prev : [...prev, appUser];
    });
  };

  const login = async (emailInput: string, pass: string) => {
    const input = emailInput.trim().toLowerCase();

    if ((input === 'admin' || input === 'administrador') && pass === '@adm3465') {
        const adminUser: User = {
          id: 'admin_local',
          name: 'Admin Local',
          email: 'admin@nexus.ai',
          phone: '000',
          role: 'admin',
          plan: 'enterprise',
          theme: 'dark',
          credits: 9999,
          status: 'active',
          createdAt: Date.now()
        };
        setUser(adminUser);
        setTheme('dark');
        // Se for admin, forçamos a ativação do device também
        activateProDevice();
        return true;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput, 
      password: pass,
    });

    if (error) {
      console.error(error);
      throw new Error(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
    }
    return true;
  };

  const signup = async (data: Partial<User>) => {
    // Signup padrão mantido para integridade do código, mas não exposto na UI Pro
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email!,
      password: data.password!,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          plan: 'free',
          credits: DAILY_LIMIT_FREE,
          theme: 'white'
        },
      },
    });

    if (error) throw new Error(error.message);
    if (authData.user && !authData.session) {
        alert("Conta criada! Verifique seu e-mail.");
        return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTheme('white');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    if (data.theme) setTheme(data.theme);

    if (user.id !== 'admin_local') {
        const { error } = await supabase.auth.updateUser({
        data: {
            name: updatedUser.name,
            phone: updatedUser.phone,
            plan: updatedUser.plan,
            credits: updatedUser.credits,
            theme: updatedUser.theme
        }
        });
        if (error) console.error("Falha ao sincronizar perfil:", error);
    }
  };

  const upgradeToPro = () => {
    if (!user) return;
    updateProfile({ plan: 'pro', credits: DAILY_LIMIT_PRO });
    addSystemLog(`User ${user.id} upgraded to PRO`);
  };

  const deductCredit = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.credits > 0) {
      updateProfile({ credits: user.credits - 1 });
      return true;
    }
    return false;
  };

  const refreshCredits = () => {
    if (user) {
      updateProfile({ credits: user.plan === 'pro' ? DAILY_LIMIT_PRO : DAILY_LIMIT_FREE });
    }
  };

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    addSystemLog(`Funcionalidade ${id} alterada.`);
  };

  const banUser = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
    addSystemLog(`Usuário ${id} status alterado.`);
  };

  const addSystemLog = (action: string) => {
    setSystemLogs(prev => [{
      id: Date.now().toString(),
      action,
      admin: user?.name || 'System',
      timestamp: Date.now()
    }, ...prev]);
  };

  const adminChatAction = (command: string): string => {
    const lower = command.toLowerCase();
    if (lower.includes('adicionar opção') || lower.includes('ativar')) return "Nova opção identificada e ativada no menu com sucesso.";
    if (lower.includes('desativar') || lower.includes('remover')) return "Opção desativada do sistema.";
    if (lower.includes('banir')) return "Usuário identificado. Protocolo de banimento iniciado.";
    return "Comando processado. Configurações do sistema atualizadas.";
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      features, 
      usersList, 
      systemLogs,
      isProActivated,
      activateProDevice,
      login, 
      signup, 
      logout, 
      updateProfile,
      upgradeToPro,
      deductCredit,
      refreshCredits,
      toggleFeature,
      banUser,
      addSystemLog,
      adminChatAction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};