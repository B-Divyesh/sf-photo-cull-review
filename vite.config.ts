import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-v6.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (asset) => asset.name?.endsWith('.css') ? 'assets/app-v6.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: { port: 4173 },
  preview: { port: 4173 },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
