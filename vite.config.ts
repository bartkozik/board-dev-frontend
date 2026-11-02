import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }): UserConfig => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    base: process.env.VITE_PUBLIC_URL,
    plugins: [react(), svgr(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXIED_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      modules: {
        generateScopedName: '[name]_[local]_[hash:base64:5]',
      },
    },
  });
};
