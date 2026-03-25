import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'), // чтобы использовать @/scss/...
    }
  },

  server: {
    open: true
  },

  build: {
    outDir: '../assets',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  },

  css: {
    postcss: './postcss.config.js',
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/utils/variables";
          @import "@/scss/utils/mixins";
        `
      }
    }
  }
});