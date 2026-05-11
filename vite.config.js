import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  server: {
    open: true,
  },

  build: {
    outDir: '../assets',
    emptyOutDir: true,
    minify: false,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'js/admin.js'),
      },

      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',

        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || ``;

          if (fileName.endsWith(`.css`)) {
            return `css/[name][extname]`;
          }

          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(fileName)) {
            return `images/[name][extname]`;
          }

          if (/\.(woff2?|ttf|otf|eot)$/i.test(fileName)) {
            return `fonts/[name][extname]`;
          }

          return `assets/[name][extname]`;
        },
      },
    },
  },

  css: {
    postcss: './postcss.config.js',

    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/utils/variables";
          @import "@/scss/utils/mixins";
        `,
      },
    },
  },
});