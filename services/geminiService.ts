import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageConfig, VideoConfig } from "../types";

// Helper to get client safely
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Chat ---
export const streamChat = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  const ai = getClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history, 
    config: {
      systemInstruction: "Você é o NexusAI, um assistente criativo futurista altamente avançado. Você ajuda os usuários a gerar ideias, códigos, textos e conceitos artísticos. Mantenha as respostas concisas, inteligentes e úteis. Responda sempre em Português do Brasil.",
    }
  });

  const result = await chat.sendMessageStream({ message });
  
  for await (const chunk of result) {
    const response = chunk as GenerateContentResponse;
    if (response.text) {
      onChunk(response.text);
    }
  }
};

// --- Image Generation ---
export const generateImage = async (prompt: string, config: ImageConfig): Promise<string> => {
  const ai = getClient();
  
  // Construct a detailed prompt based on config
  const enhancedPrompt = `${prompt}. Style: ${config.style}. High quality, detailed.`;
  
  // Usando modelos flash para ser mais rápido e econômico por padrão, ou Pro se for HD
  const model = config.quality === 'hd' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const imgSize = config.quality === 'hd' ? '2K' : undefined;

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: enhancedPrompt }] },
    config: {
      imageConfig: {
        aspectRatio: config.aspectRatio,
        imageSize: imgSize
      }
    }
  });

  // Extract Image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Não foi possível gerar a imagem.");
};

// --- Video Generation (Veo) ---
export const generateVideo = async (prompt: string, config: VideoConfig): Promise<string> => {
  // Para Veo, o usuário precisa selecionar a chave PAGA dele na UI, pois é muito custoso.
  // Se não selecionar, tentaremos usar a chave hardcoded, mas pode falhar se não tiver cota.
  let ai: GoogleGenAI;
  const win = window as any;
  
  if (win.aistudio && await win.aistudio.hasSelectedApiKey()) {
     ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 
  } else {
     ai = getClient();
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio
    }
  });

  // Polling
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Falha na geração de vídeo.");

  // Fetch actual video bytes (Appending Key)
  const res = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!res.ok) throw new Error("Falha ao baixar o vídeo.");
  
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// --- Text Tools (Generic) ---
export const generateTextTool = async (toolType: string, input: string): Promise<string> => {
  const ai = getClient();
  
  const promptMap: Record<string, string> = {
    'marketing': 'Crie um post de marketing atraente para:',
    'ebook': 'Escreva um esboço detalhado de capítulo para um e-book sobre:',
    'site-gen': 'Gere a estrutura HTML e CSS (Tailwind) para um site sobre:',
    'app-builder': 'Descreva a arquitetura técnica e funcionalidades para um app de:',
  };

  const basePrompt = promptMap[toolType] || 'Crie conteúdo profissional e criativo sobre:';
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${basePrompt} ${input}. Responda em Português.`,
  });

  return response.text || "Não foi possível gerar o texto.";
};