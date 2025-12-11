import React, { useState } from 'react';
import { Video, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { generateVideo } from '../services/geminiService';
import { VideoConfig } from '../types';

const VideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<VideoConfig>({ aspectRatio: '16:9', resolution: '720p' });
  
  const { deductCredit } = useApp();

  const handleGenerate = async () => {
    // Veo check for Key
    const win = window as any;
    if (win.aistudio && !await win.aistudio.hasSelectedApiKey()) {
        try {
            await win.aistudio.openSelectKey();
        } catch(e) {
            alert("Seleção de API Key cancelada.");
            return;
        }
    }

    if (!deductCredit()) {
        alert("Créditos insuficientes.");
        return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const url = await generateVideo(prompt, config);
      setVideoUrl(url);
    } catch (e: any) {
      console.error(e);
      alert("Falha na geração do vídeo. Certifique-se de usar uma chave paga compatível com Veo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-main">Motion Lab (Veo)</h1>
        <p className="text-text-muted">Gere vídeos de alta qualidade a partir de texto.</p>
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs border border-amber-500/20">
            <AlertTriangle size={12} />
            Requer Seleção de API Key Paga
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border-border space-y-6">
        <textarea
          className="w-full bg-bg-input border border-border rounded-xl p-4 text-text-main focus:border-primary outline-none h-32"
          placeholder="Um drone cinematográfico filmando uma cidade futurista ao pôr do sol..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <div className="flex gap-4">
             <select 
                className="bg-bg-input border border-border rounded-lg p-2 text-text-main"
                value={config.aspectRatio}
                onChange={(e) => setConfig({...config, aspectRatio: e.target.value as any})}
             >
                 <option value="16:9">Paisagem (16:9)</option>
                 <option value="9:16">Retrato (9:16)</option>
             </select>
        </div>

        <Button onClick={handleGenerate} loading={loading} glow className="w-full">
            <Video size={18} />
            Gerar Vídeo
        </Button>
      </div>

      {loading && (
          <div className="text-center py-12">
              <div className="animate-pulse-slow text-primary text-lg">
                Renderizando a matriz de realidade... (Isso pode levar um minuto)
              </div>
              <div className="w-full bg-bg-input h-1 mt-4 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[width_60s_linear] w-0"></div>
              </div>
          </div>
      )}

      {videoUrl && (
          <div className="glass-panel p-2 rounded-2xl">
              <video controls src={videoUrl} className="w-full rounded-xl" autoPlay loop />
          </div>
      )}
    </div>
  );
};

export default VideoGen;