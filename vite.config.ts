import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo.
  // O casting (process as any) evita erros de TS em ambientes CI/CD restritos.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    base: './',
    plugins: [react()],
    define: {
      // Injeta a API Key no build
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