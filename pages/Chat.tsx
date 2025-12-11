import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User as UserIcon, Loader2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { streamChat } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { deductCredit } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    if (!deductCredit()) {
      alert("Você ficou sem créditos. Por favor, atualize para o plano Pro.");
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      let fullResponse = "";
      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      await streamChat(history, userMsg.text, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === botMsgId ? { ...m, text: fullResponse } : m
        ));
      });

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Erro: Não foi possível conectar ao núcleo neural. Tente novamente.",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] md:h-[calc(100vh-6rem)] relative">
      <div className="flex justify-between items-center mb-2 md:mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
            <Bot className="text-primary" /> Chat Neural
        </h2>
        <button 
          onClick={() => setMessages([])} 
          className="text-text-muted hover:text-red-400 transition-colors p-2 bg-bg-card rounded-lg border border-border"
          title="Limpar Histórico"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 md:space-y-6 pr-1 custom-scrollbar pb-20 md:pb-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-60 p-4 text-center">
             <div className="w-16 h-16 bg-bg-card rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Bot size={32} className="text-primary" />
             </div>
             <p className="text-lg font-medium text-text-main">NexusAI está pronto.</p>
             <p className="text-sm mt-1">Gere códigos, textos e ideias.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary' : 'bg-violet-600'}`}>
              {msg.role === 'user' ? <UserIcon size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl text-sm md:text-base shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-bg-card text-text-main rounded-tl-none border border-border'
            } ${msg.isError ? 'border-red-500/50 bg-red-900/10' : ''}`}>
              <div className="prose prose-sm prose-invert max-w-none break-words leading-relaxed">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
               <Bot size={14} className="text-white" />
             </div>
             <div className="bg-bg-card px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-border">
               <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
               <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Sticky Bottom on Mobile) */}
      <div className="absolute bottom-0 left-0 right-0 md:relative bg-bg-main md:bg-transparent pt-2 pb-4 md:pb-0">
        <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 border border-border shadow-xl md:shadow-soft bg-bg-card">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-text-main placeholder-text-muted px-4 py-3 text-base"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            style={{ fontSize: '16px' }} // Prevent iOS zoom
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-primary hover:opacity-90 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white p-3 rounded-xl transition-all duration-300 shadow-soft shrink-0"
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;