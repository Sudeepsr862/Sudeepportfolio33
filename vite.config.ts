
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three'],
            'react-vendor': ['react', 'react-dom'],
            'animation-vendor': ['framer-motion', '@react-three/fiber', '@react-three/drei'],
          }
        }
      }
    },
    server: {
      port: 3000,
    },
  };
});
