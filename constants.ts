import { AppFeature, ImageConfig, VideoConfig } from "./types";

export const DAILY_LIMIT_FREE = 5;
export const DAILY_LIMIT_PRO = 100;

export const THEMES = [
  { id: 'white', label: 'Branco (Padrão)', hex: '#ffffff' },
  { id: 'blue', label: 'Azul', hex: '#3b82f6' },
  { id: 'purple', label: 'Roxo', hex: '#a855f7' },
  { id: 'green', label: 'Verde', hex: '#22c55e' },
  { id: 'dark', label: 'Escuro', hex: '#0f172a' },
];

export const INITIAL_FEATURES: AppFeature[] = [
  // --- Destaque Vendas (ITEM ÚNICO ADICIONADO/MANTIDO) ---
  { id: 'pro-sales', label: 'Plano Pro (Assinar)', path: '/pro', icon: 'Crown', enabled: true, category: 'utility', description: 'Desbloqueie todo o poder da IA.' },

  // --- Principais ---
  { id: 'chat', label: 'Chat IA', path: '/tool/chat', icon: 'MessageSquare', enabled: true, category: 'create', description: 'Converse com a IA mais avançada.' },
  { id: 'image', label: 'Criar Imagens', path: '/tool/image', icon: 'Image', enabled: true, category: 'create', description: 'Gere imagens realistas e artísticas.' },
  { id: 'video', label: 'Criar Vídeos Curtos', path: '/tool/video', icon: 'Video', enabled: true, category: 'create', description: 'Gere vídeos incríveis com Veo.' },
  
  // --- Novidade ---
  { id: 'learn-ai', label: 'Aprender com IA', path: '/tool/learn-ai', icon: 'GraduationCap', enabled: true, category: 'create', description: 'Cursos e tutoriais guiados por IA.' },

  // --- Criação & Design ---
  { id: 'site-gen', label: 'Gerador de Sites', path: '/tool/site-gen', icon: 'Globe', enabled: true, category: 'create', description: 'Crie sites completos descrevendo o que deseja.' },
  { id: 'app-builder', label: 'Construtor de Apps', path: '/tool/app-builder', icon: 'Smartphone', enabled: true, category: 'create', description: 'Crie aplicativos No-Code via IA.' },
  { id: 'remove-bg', label: 'Remover Fundo', path: '/tool/remove-bg', icon: 'Eraser', enabled: true, category: 'media', description: 'Remova fundos de imagens automaticamente.' },
  { id: 'upscale-8k', label: 'Melhorador 8K', path: '/tool/upscale-8k', icon: 'MonitorUp', enabled: true, category: 'media', description: 'Aumente a qualidade de fotos para 8K.' },
  { id: 'character-gen', label: 'Gerador de Personagens', path: '/tool/character-gen', icon: 'User', enabled: true, category: 'create', description: 'Estilo Pixar, anime ou realista.' },
  { id: 'photo-to-art', label: 'Foto em Desenho', path: '/tool/photo-to-art', icon: 'Palette', enabled: true, category: 'media', description: 'Transforme fotos reais em ilustrações.' },
  { id: '3d-model', label: 'Modelos 3D', path: '/tool/3d-model', icon: 'Box', enabled: true, category: 'media', description: 'Gere assets 3D básicos.' },
  { id: 'logo', label: 'Gerador de Logos', path: '/tool/logo', icon: 'Hexagon', enabled: true, category: 'media', description: 'Conceitos de marca profissionais.' },
  { id: 'banner', label: 'Gerador de Banners', path: '/tool/banner', icon: 'LayoutTemplate', enabled: true, category: 'media', description: 'Banners para sites e redes sociais.' },
  { id: 'thumbnails', label: 'Capas & Thumbs', path: '/tool/thumbnails', icon: 'Image', enabled: true, category: 'media', description: 'Capas atrativas para vídeos.' },
  { id: 'reels-maker', label: 'Criador de Reels', path: '/tool/reels-maker', icon: 'Film', enabled: true, category: 'social', description: 'Vídeos verticais com música.' },
  { id: 'tiktok-covers', label: 'Capas TikTok', path: '/tool/tiktok-covers', icon: 'Smartphone', enabled: true, category: 'social', description: 'Capas virais para Shorts e TikTok.' },
  { id: 'emoji-gen', label: 'Emojis Personalizados', path: '/tool/emoji-gen', icon: 'Smile', enabled: true, category: 'media', description: 'Crie seus próprios emojis exclusivos.' },
  
  // --- Conteúdo & Texto ---
  { id: 'writer', label: 'Textos Prontos', path: '/tool/writer', icon: 'FileText', enabled: true, category: 'create', description: 'Artigos, redações e blogs.' },
  { id: 'ebook', label: 'Gerador de E-books', path: '/tool/ebook', icon: 'BookOpen', enabled: true, category: 'create', description: 'Escreva livros completos.' },
  { id: 'slides', label: 'Gerador de Slides', path: '/tool/slides', icon: 'Presentation', enabled: true, category: 'utility', description: 'Apresentações completas em segundos.' },
  { id: 'pdf-gen', label: 'Gerador de PDFs', path: '/tool/pdf-gen', icon: 'FileType', enabled: true, category: 'utility', description: 'Documentos formatados automaticamente.' },
  { id: 'contracts', label: 'Contratos Prontos', path: '/tool/contracts', icon: 'ScrollText', enabled: true, category: 'utility', description: 'Jurídico: Compra, venda e serviços.' },
  { id: 'subtitles', label: 'Legendas Automáticas', path: '/tool/subtitles', icon: 'Subtitles', enabled: true, category: 'media', description: 'Transcreva vídeos para texto.' },
  { id: 'translation', label: 'Tradutor Universal', path: '/tool/translation', icon: 'Languages', enabled: true, category: 'utility', description: 'Tradução contextual precisa.' },
  
  // --- Áudio & Voz ---
  { id: 'music-gen', label: 'Gerador de Músicas', path: '/tool/music-gen', icon: 'Music', enabled: true, category: 'create', description: 'Crie trilhas sonoras originais.' },
  { id: 'voice-gen', label: 'Gerador de Voz', path: '/tool/voice-gen', icon: 'Mic', enabled: true, category: 'create', description: 'TTS realista: narrador, masculino, feminino.' },
  { id: 'voice-to-text', label: 'Voz para Texto', path: '/tool/voice-to-text', icon: 'Mic2', enabled: true, category: 'utility', description: 'Transcreva áudios e reuniões.' },
  { id: 'text-to-voice', label: 'Texto para Voz', path: '/tool/text-to-voice', icon: 'Speaker', enabled: true, category: 'utility', description: 'Leitura em voz alta natural.' },
  { id: 'audio-chat', label: 'Chat de Áudio', path: '/tool/audio-chat', icon: 'Headphones', enabled: true, category: 'social', description: 'Converse com a IA por voz.' },

  // --- Social & Marketing ---
  { id: 'instagram', label: 'Post Instagram', path: '/tool/instagram', icon: 'Instagram', enabled: true, category: 'social', description: 'Legendas, hashtags e imagem.' },
  { id: 'full-post', label: 'Post Completo', path: '/tool/full-post', icon: 'Share2', enabled: true, category: 'social', description: 'Imagem + Texto + Hashtags.' },
  { id: 'quotes', label: 'Citações Motivacionais', path: '/tool/quotes', icon: 'Quote', enabled: true, category: 'social', description: 'Frases para inspirar.' },
  { id: 'carousels', label: 'Carrosséis', path: '/tool/carousels', icon: 'Layers', enabled: true, category: 'social', description: 'Roteiro para posts em carrossel.' },
  { id: 'landing-page', label: 'Landing Pages', path: '/tool/landing-page', icon: 'Layout', enabled: true, category: 'create', description: 'Copywriting para páginas de venda.' },
  { id: 'push-notif', label: 'Notificações Push', path: '/tool/push-notif', icon: 'Bell', enabled: true, category: 'social', description: 'Textos curtos para engajamento.' },

  // --- Negócios & Utilidades ---
  { id: 'ideas', label: 'Explorar Ideias', path: '/tool/ideas', icon: 'Lightbulb', enabled: true, category: 'create', description: 'Brainstorming de negócios e apps.' },
  { id: 'study-buddy', label: 'Assistente de Estudo', path: '/tool/study-buddy', icon: 'Book', enabled: true, category: 'utility', description: 'Resumos e questões de prova.' },
  { id: 'organizer', label: 'Organizador Pessoal', path: '/tool/organizer', icon: 'CheckSquare', enabled: true, category: 'utility', description: 'Metas e tarefas diárias.' },
  { id: 'smart-agenda', label: 'Agenda Inteligente', path: '/tool/smart-agenda', icon: 'Calendar', enabled: true, category: 'utility', description: 'Planejamento com lembretes.' },
  { id: 'qr-code', label: 'Códigos QR', path: '/tool/qr-code', icon: 'QrCode', enabled: true, category: 'utility', description: 'Gerar e ler QR Codes.' },
  { id: 'digital-store', label: 'Loja Digital', path: '/tool/digital-store', icon: 'ShoppingBag', enabled: true, category: 'create', description: 'Monte sua vitrine virtual.' },
  { id: 'premium-market', label: 'Vender Templates', path: '/tool/premium-market', icon: 'Tag', enabled: true, category: 'create', description: 'Marketplace de prompts e designs.' },
  { id: 'support-bot', label: 'Bot de Atendimento', path: '/tool/support-bot', icon: 'Bot', enabled: true, category: 'utility', description: 'Script para SAC automático.' },
  { id: 'payments', label: 'Sistema Pix', path: '/tool/payments', icon: 'DollarSign', enabled: true, category: 'utility', description: 'Gestão de pagamentos recorrentes.' },
  { id: 'affiliates', label: 'Área de Afiliados', path: '/tool/affiliates', icon: 'Users', enabled: true, category: 'utility', description: 'Ganhe indicando o app.' },
  { id: 'relationship', label: 'Conselheiro Amoroso', path: '/tool/relationship', icon: 'Heart', enabled: true, category: 'social', description: 'Dicas de relacionamento.' },
  { id: 'avatar-sim', label: 'Simulador Avatar', path: '/tool/avatar-sim', icon: 'UserPlus', enabled: true, category: 'social', description: 'Interação com personas virtuais.' },
  
  // --- Sistema ---
  { id: 'library', label: 'Minha Biblioteca', path: '/library', icon: 'Folder', enabled: true, category: 'utility', description: 'Seus arquivos salvos.' },
  { id: 'favorites', label: 'Favoritos', path: '/favorites', icon: 'Star', enabled: true, category: 'utility', description: 'Ferramentas preferidas.' },
  { id: 'history', label: 'Histórico', path: '/history', icon: 'Clock', enabled: true, category: 'utility', description: 'Atividades recentes.' },
  { id: 'community', label: 'Comunidade', path: '/community', icon: 'Users', enabled: true, category: 'social', description: 'Feed global de usuários.' },
];

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  aspectRatio: "1:1",
  style: "Realista",
  quality: "standard"
};

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  aspectRatio: "16:9",
  resolution: "720p"
};

export const IMAGE_STYLES = [
  "Fotorealista", "Cyberpunk", "Anime", "Render 3D", "Pintura a Óleo", "Minimalista", "Cinematográfico", "Pixel Art", "Vaporwave"
];

export const ASPECT_RATIOS = [
  { value: "1:1", label: "Quadrado (1:1)" },
  { value: "16:9", label: "Paisagem (16:9)" },
  { value: "9:16", label: "Retrato (9:16)" },
  { value: "4:3", label: "Padrão (4:3)" },
  { value: "3:4", label: "Vertical (3:4)" },
];