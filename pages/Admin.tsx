import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Users, Activity, ToggleLeft, ToggleRight, Trash2, Shield, Send, Terminal, Ban, CheckCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { usersList, features, toggleFeature, banUser, systemLogs, adminChatAction } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>('overview');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([
      { role: 'system', text: 'Sistema administrativo iniciado. Aguardando comandos...' }
  ]);

  const stats = {
      totalUsers: usersList.length,
      activeUsers: usersList.filter(u => u.status === 'active').length,
      bannedUsers: usersList.filter(u => u.status === 'banned').length,
      proUsers: usersList.filter(u => u.plan !== 'free').length,
  };

  const handleChat = () => {
      if (!chatInput.trim()) return;
      const response = adminChatAction(chatInput);
      setChatLog(prev => [
          ...prev, 
          { role: 'admin', text: chatInput },
          { role: 'system', text: response }
      ]);
      setChatInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold text-text-main">Painel Administrativo</h1>
         <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
             ACESSO RESTRITO
         </div>
      </div>

      <div className="flex gap-2 border-b border-border pb-1">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}>Usuários</button>
          <button onClick={() => setActiveTab('system')} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'system' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-main'}`}>Sistema & IA</button>
      </div>

      {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-bg-card p-6 rounded-2xl shadow-soft border border-border">
                 <div className="text-text-muted text-sm mb-1">Total Usuários</div>
                 <div className="text-3xl font-bold text-text-main">{stats.totalUsers}</div>
             </div>
             <div className="bg-bg-card p-6 rounded-2xl shadow-soft border border-border">
                 <div className="text-text-muted text-sm mb-1">Assinantes PRO</div>
                 <div className="text-3xl font-bold text-primary">{stats.proUsers}</div>
             </div>
             <div className="bg-bg-card p-6 rounded-2xl shadow-soft border border-border">
                 <div className="text-text-muted text-sm mb-1">Banidos</div>
                 <div className="text-3xl font-bold text-red-500">{stats.bannedUsers}</div>
             </div>
             <div className="bg-bg-card p-6 rounded-2xl shadow-soft border border-border">
                 <div className="text-text-muted text-sm mb-1">Ações Sistema</div>
                 <div className="text-3xl font-bold text-green-500">{systemLogs.length}</div>
             </div>

             <div className="md:col-span-2 bg-bg-card p-6 rounded-2xl shadow-soft border border-border">
                 <h3 className="text-lg font-bold mb-4">Funcionalidades do App</h3>
                 <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                     {features.map(feat => (
                         <div key={feat.id} className="flex items-center justify-between p-3 bg-bg-input rounded-xl">
                             <span className="text-sm font-medium">{feat.label}</span>
                             <button onClick={() => toggleFeature(feat.id)}>
                                 {feat.enabled ? <ToggleRight className="text-green-500" size={24} /> : <ToggleLeft className="text-text-muted" size={24} />}
                             </button>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
      )}

      {activeTab === 'users' && (
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                  <thead className="bg-bg-input text-text-muted uppercase">
                      <tr>
                          <th className="p-4">Nome</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Plano</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {usersList.map(u => (
                          <tr key={u.id}>
                              <td className="p-4 font-medium">{u.name}</td>
                              <td className="p-4 text-text-muted">{u.email}</td>
                              <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold">{u.plan.toUpperCase()}</span></td>
                              <td className="p-4">
                                  {u.status === 'active' ? (
                                      <span className="text-green-500 flex items-center gap-1"><CheckCircle size={14} /> Ativo</span>
                                  ) : (
                                      <span className="text-red-500 flex items-center gap-1"><Ban size={14} /> Banido</span>
                                  )}
                              </td>
                              <td className="p-4">
                                  {u.role !== 'admin' && (
                                      <button onClick={() => banUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                          {u.status === 'active' ? 'Banir' : 'Reativar'}
                                      </button>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
              {/* Chat Terminal */}
              <div className="bg-gray-900 text-green-400 rounded-2xl p-4 font-mono flex flex-col h-full shadow-xl">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                      <Terminal size={18} />
                      <span className="text-sm font-bold">TERMINAL DE COMANDO - NEXUS KERNEL</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                      {chatLog.map((msg, idx) => (
                          <div key={idx} className={msg.role === 'admin' ? 'text-white' : 'text-green-400'}>
                              <span className="opacity-50 text-xs">[{new Date().toLocaleTimeString()}]</span> {msg.role === 'admin' ? '> ' : '# '} {msg.text}
                          </div>
                      ))}
                  </div>
                  <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-gray-800 border-none outline-none text-white px-3 py-2 rounded-lg"
                        placeholder="Digite um comando (ex: Ativar chat, Banir usuário...)"
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                        autoFocus
                      />
                      <button onClick={handleChat} className="bg-green-600 text-black px-4 rounded-lg font-bold hover:bg-green-500">
                          <Send size={18} />
                      </button>
                  </div>
              </div>

              {/* Logs */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 overflow-y-auto">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} /> Logs do Sistema</h3>
                  <div className="space-y-4">
                      {systemLogs.map(log => (
                          <div key={log.id} className="text-sm border-l-2 border-primary pl-4 py-1">
                              <p className="font-medium text-text-main">{log.action}</p>
                              <p className="text-xs text-text-muted">{new Date(log.timestamp).toLocaleString()} - por {log.admin}</p>
                          </div>
                      ))}
                      {systemLogs.length === 0 && <p className="text-text-muted text-sm">Nenhuma atividade registrada.</p>}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
