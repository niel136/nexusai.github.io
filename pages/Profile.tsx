import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { THEMES } from '../constants';
import { User, Mail, Phone, Palette, Save } from 'lucide-react';
import { ThemeColor } from '../types';

const Profile: React.FC = () => {
  const { user, updateProfile } = useApp();
  const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
  });

  const handleSave = () => {
      updateProfile(formData);
      alert("Perfil atualizado com sucesso!");
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <div>
         <h1 className="text-3xl font-bold text-text-main">Meu Perfil</h1>
         <p className="text-text-muted">Gerencie suas informações e preferências.</p>
       </div>

       <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-soft space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-text-main"><User size={20} /> Informações Pessoais</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted">Nome</label>
                  <input 
                    className="w-full bg-bg-input border border-border rounded-xl p-3 text-text-main focus:border-primary outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted">E-mail</label>
                  <input 
                    className="w-full bg-bg-input border border-border rounded-xl p-3 text-text-main focus:border-primary outline-none"
                    value={formData.email}
                    readOnly
                    title="E-mail não pode ser alterado"
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted">Telefone</label>
                  <input 
                    className="w-full bg-bg-input border border-border rounded-xl p-3 text-text-main focus:border-primary outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
              </div>
          </div>
       </div>

       <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-soft space-y-6">
           <h2 className="text-xl font-bold flex items-center gap-2 text-text-main"><Palette size={20} /> Aparência</h2>
           <p className="text-sm text-text-muted">Escolha o tema que mais combina com você.</p>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
               {THEMES.map(theme => (
                   <button
                     key={theme.id}
                     onClick={() => updateProfile({ theme: theme.id as ThemeColor })}
                     className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${user.theme === theme.id ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-bg-input'}`}
                   >
                       <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.hex }}></div>
                       <span className="text-xs font-medium text-text-main">{theme.label}</span>
                   </button>
               ))}
           </div>
       </div>

       <div className="flex justify-end">
           <Button onClick={handleSave} size="lg">
              <Save size={18} /> Salvar Alterações
           </Button>
       </div>
    </div>
  );
};

export default Profile;
