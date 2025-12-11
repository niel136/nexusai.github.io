import React, { useState } from 'react';
import { Download, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { generateImage } from '../services/geminiService';
import { ASPECT_RATIOS, IMAGE_STYLES, DEFAULT_IMAGE_CONFIG } from '../constants';
import { ImageConfig } from '../types';

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState<ImageConfig>(DEFAULT_IMAGE_CONFIG);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { deductCredit, user } = useApp();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (config.quality === 'hd' && user.plan !== 'pro') {
      alert("Alta Definição (HD) requer o Plano Pro.");
      return;
    }

    if (!deductCredit()) {
       alert("Créditos esgotados.");
       return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImg(null);

    try {
      const imgData = await generateImage(prompt, config);
      setGeneratedImg(imgData);
    } catch (err) {
      setError("Falha ao gerar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 md:gap-8 h-full">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-4 md:space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-main mb-1">Forja de Imagens</h2>
          <p className="text-text-muted text-sm">Descreva o que você imagina.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Prompt</label>
            <textarea
              className="w-full h-24 md:h-32 bg-bg-input border border-border rounded-xl p-4 text-text-main placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-base"
              placeholder="Uma cidade futurista com carros voadores, luzes neon..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Proporção</label>
                <select 
                  className="w-full bg-bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                  value={config.aspectRatio}
                  onChange={(e) => setConfig({...config, aspectRatio: e.target.value})}
                >
                  {ASPECT_RATIOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Estilo</label>
                <select 
                  className="w-full bg-bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                  value={config.style}
                  onChange={(e) => setConfig({...config, style: e.target.value})}
                >
                  {IMAGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>

          <div className="glass-panel p-3 md:p-4 rounded-xl flex items-center justify-between border border-border">
            <div>
              <span className="block text-sm font-medium text-text-main">Upscale (HD)</span>
              <span className="text-xs text-text-muted">Gera resolução 2K</span>
            </div>
            <button 
              onClick={() => setConfig({...config, quality: config.quality === 'standard' ? 'hd' : 'standard'})}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.quality === 'hd' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${config.quality === 'hd' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <Button 
            onClick={handleGenerate} 
            loading={loading} 
            glow 
            className="w-full py-4 text-lg"
            disabled={!prompt}
          >
            <Sparkles size={20} />
            Gerar Agora
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2 bg-bg-input rounded-2xl border border-border flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[400px]">
        {loading ? (
           <div className="text-center">
             <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-primary animate-pulse text-sm md:text-base">Forjando pixels...</p>
           </div>
        ) : generatedImg ? (
          <div className="relative group w-full h-full flex items-center justify-center p-2 md:p-4">
            <img 
              src={generatedImg} 
              alt="Gerada" 
              className="max-h-[50vh] lg:max-h-full max-w-full rounded-lg shadow-2xl object-contain"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a 
                href={generatedImg} 
                download={`nexus-ai-${Date.now()}.png`}
                className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
              >
                <Download size={24} />
              </a>
            </div>
          </div>
        ) : error ? (
          <div className="text-center max-w-xs text-red-400">
             <AlertCircle size={48} className="mx-auto mb-2" />
             <p>{error}</p>
          </div>
        ) : (
          <div className="text-center text-text-muted">
            <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
            <p>Sua arte aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGen;