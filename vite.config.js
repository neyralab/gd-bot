import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    port: 3000
  },
  plugins: [
    react(),
    svgr({
      include: ['**/*.svg']
    }),
    nodePolyfills({
      include: ['path', 'stream', 'util'],
      exclude: ['http'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      overrides: {
        fs: 'memfs'
      },
      protocolImports: true
    })
  ],
  define: { 'process.env': process.env }
});
