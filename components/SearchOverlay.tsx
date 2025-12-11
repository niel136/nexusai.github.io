import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppFeature } from '../types';
import * as Icons from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AppFeature[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { features, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Smart Filter Logic
    const filtered = features.filter(feature => {
      // Admin check
      if (lowerQuery.includes('admin') && user?.role !== 'admin') return false;
      
      const matchesName = feature.label.toLowerCase().includes(lowerQuery);
      const matchesDesc = feature.description.toLowerCase().includes(lowerQuery);
      const matchesId = feature.id.toLowerCase().includes(lowerQuery);
      
      // Category matching
      let matchesCategory = false;
      if (lowerQuery.includes('imagem') || lowerQuery.includes('foto')) matchesCategory = feature.category === 'media' || feature.id.includes('image');
      if (lowerQuery.includes('video') || lowerQuery.includes('filme')) matchesCategory = feature.id.includes('video') || feature.id.includes('reel');
      if (lowerQuery.includes('voz') || lowerQuery.includes('audio')) matchesCategory = feature.id.includes('voice') || feature.id.includes('audio') || feature.id.includes('music');
      if (lowerQuery.includes('texto') || lowerQuery.includes('escrever')) matchesCategory = feature.id.includes('writer') || feature.id.includes('copy');

      return matchesName || matchesDesc || matchesId || matchesCategory;
    });

    setResults(filtered.slice(0, 8)); // Limit to 8 results for clean UI
  }, [query, features, user]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  // Get dynamic icon
  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] || Icons.Grid;
    return Icon;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-16 px-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="w-full max-w-2xl relative z-50 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl py-5 pl-12 pr-12 text-lg text-slate-800 dark:text-white shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-slate-400"
            placeholder="O que você quer criar hoje?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          <button 
            onClick={onClose}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Results List */}
        {query && (
          <div className="mt-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((feature) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleSelect(feature.path)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                          {feature.label}
                          {!feature.enabled && <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded">OFF</span>}
                          {feature.id === 'learn-ai' && <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">NOVO</span>}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{feature.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Zap className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>Nenhuma ferramenta encontrada para "{query}".</p>
                <p className="text-xs mt-1">Tente "imagem", "vídeo" ou "texto".</p>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Suggestions (Empty State) */}
        {!query && (
           <div className="mt-4 flex flex-wrap gap-2 justify-center opacity-0 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-forwards" style={{animationDelay: '100ms'}}>
              {['Gerar Site', 'Criar Logo', 'Chat IA', 'Remover Fundo', 'Instagram'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 bg-white/40 dark:bg-black/40 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-black/60 transition-colors"
                  >
                      {tag}
                  </button>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};