import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
