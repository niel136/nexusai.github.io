import React, { useState } from 'react';
import { BookOpen, Music, Share2, UserSquare2, FileText, ChevronRight } from 'lucide-react';
import { generateTextTool } from '../services/geminiService';
import { Button } from '../components/ui/Button';

const tools = [
  { id: 'marketing', icon: Share2, title: 'Social Posts', desc: 'Viral captions & hooks', color: 'text-pink-400' },
  { id: 'ebook', icon: BookOpen, title: 'E-Book Maker', desc: 'Outlines & Chapters', color: 'text-blue-400' },
  { id: 'lyrics', icon: Music, title: 'Songwriter', desc: 'Lyrics & Composition', color: 'text-green-400' },
  { id: 'avatar', icon: UserSquare2, title: 'Avatar Prompts', desc: 'Character descriptions', color: 'text-purple-400' },
];

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!input || !activeTool) return;
    setLoading(true);
    try {
      const res = await generateTextTool(activeTool, input);
      setResult(res);
    } catch (e) {
        setResult("Error generating content.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full">
      {!activeTool ? (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Creative Suite</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="glass-panel p-6 rounded-2xl hover:bg-slate-800/80 transition-all hover:-translate-y-1 text-left group border-slate-800"
                    >
                        <div className={`w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 ${tool.color} group-hover:scale-110 transition-transform`}>
                            <tool.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{tool.title}</h3>
                        <p className="text-slate-400 text-sm">{tool.desc}</p>
                        <div className="mt-4 flex items-center text-xs font-semibold text-slate-500 uppercase tracking-widest group-hover:text-cyan-400">
                            Launch <ChevronRight size={12} className="ml-1" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <button onClick={() => { setActiveTool(null); setResult(''); setInput(''); }} className="text-slate-400 hover:text-white mb-4 flex items-center gap-2">
                &larr; Back to Tools
            </button>
            <div className="glass-panel p-8 rounded-2xl border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4">
                    {tools.find(t => t.id === activeTool)?.title}
                </h2>
                <div className="space-y-4">
                    <textarea 
                        className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 text-white h-32 focus:border-cyan-500 outline-none"
                        placeholder="Describe what you want to create..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button onClick={handleRun} loading={loading} className="w-full">Generate</Button>
                </div>
                {result && (
                    <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800 whitespace-pre-wrap text-slate-300">
                        {result}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
