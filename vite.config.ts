import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        // 本地开发：/api/* 直接代理到 WeBASE-Front（生产环境由 Vercel Functions 处理）
        '/api/users': {
          target: 'http://8.137.93.11:5002',
          changeOrigin: true,
          rewrite: () => '/WeBASE-Front/privateKey/localKeyStores',
        },
        '/api/compile': {
          target: 'http://8.137.93.11:5002',
          changeOrigin: true,
          rewrite: () => '/WeBASE-Front/contract/contractCompile',
        },
        '/api/deploy': {
          target: 'http://8.137.93.11:5002',
          changeOrigin: true,
          rewrite: () => '/WeBASE-Front/contract/deploy',
        },
      },
    },
  };
});
