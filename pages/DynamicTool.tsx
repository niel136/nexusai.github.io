import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateTextTool } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const DynamicTool: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { features, deductCredit } = useApp();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const feature = features.find(f => f.id === id);

  useEffect(() => {
    setInput('');
    setOutput('');
  }, [id]);

  if (!feature) return <div>Ferramenta não encontrada.</div>;
  if (!feature.enabled) return <div>Esta ferramenta está desativada temporariamente.</div>;

  const handleGenerate = async () => {
    if (!input.trim()) return;
    if (!deductCredit()) {
        alert("Créditos insuficientes. Atualize seu plano.");
        return;
    }

    setLoading(true);
    try {
        const prompt = `Atue como um especialista em ${feature.label}. O usuário pediu: "${input}". Gere o melhor resultado possível, formatado e criativo.`;
        const result = await generateTextTool(feature.id, prompt);
        setOutput(result);
    } catch (e) {
        setOutput("Erro ao gerar conteúdo. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col md:flex-row gap-6">
       {/* Left Input */}
       <div className="md:w-1/3 space-y-4">
          <div className="bg-bg-card p-6 rounded-2xl border border-border shadow-soft">
              <div className="flex items-center gap-3 mb-4 text-primary">
                  {/* Icon placeholder logic handled in Layout, keeping simple here */}
                  <Sparkles size={24} />
                  <h1 className="text-xl font-bold text-text-main">{feature.label}</h1>
              </div>
              <p className="text-sm text-text-muted mb-4">{feature.description}</p>
              
              <textarea 
                className="w-full h-40 bg-bg-input border border-border rounded-xl p-4 text-text-main focus:border-primary outline-none resize-none text-sm"
                placeholder="Descreva o que você deseja criar..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              
              <Button onClick={handleGenerate} loading={loading} className="w-full mt-4">
                  Gerar com IA
              </Button>
          </div>
       </div>

       {/* Right Output */}
       <div className="md:w-2/3 flex-1 bg-bg-card rounded-2xl border border-border shadow-soft p-6 relative min-h-[500px] flex flex-col">
           {output ? (
               <>
                 <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                     <span className="text-sm font-bold text-text-muted uppercase">Resultado</span>
                     <button onClick={handleCopy} className="text-text-muted hover:text-primary transition-colors">
                         {copied ? <Check size={18} /> : <Copy size={18} />}
                     </button>
                 </div>
                 <div className="flex-1 overflow-y-auto prose prose-sm max-w-none text-text-main prose-headings:text-text-main prose-strong:text-text-main">
                     <ReactMarkdown>{output}</ReactMarkdown>
                 </div>
               </>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
                   {loading ? (
                       <div className="animate-pulse flex flex-col items-center">
                           <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
                           <div className="h-4 w-32 bg-primary/20 rounded mb-2"></div>
                           <div className="h-4 w-24 bg-primary/20 rounded"></div>
                       </div>
                   ) : (
                       <>
                         <Sparkles size={48} className="mb-4" />
                         <p>O resultado aparecerá aqui.</p>
                       </>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};