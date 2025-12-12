import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (development/production)
  // O uso de process.cwd() agora é seguro devido ao @types/node no package.json
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    // CRÍTICO: Define a base como relativa. Isso permite que o app funcione
    // dentro de subpastas ou proxies de preview (como Google IDX) sem quebrar os caminhos dos assets.
    base: './',
    
    plugins: [react()],
    define: {
      // O SDK @google/genai espera process.env.API_KEY.
      // Substituímos pelo valor real em tempo de build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || '')
    },
    server: {
      port: 3000,
      host: true 
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000
    }
  };
});