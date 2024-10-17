import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { threeMinifier } from '@yushijinhun/three-minifier-rollup';

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    port: 3000,
    host: true
  },
  plugins: [
    threeMinifier(),
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
  define: { 'process.env': process.env },
  build: {
    minify: 'terser', // Use 'terser' for better compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'], // Remove console logs
        passes: 3 // Increase the number of passes for compression
      },
      mangle: true, // Enable mangling for shorter variable names
      module: true, // Enable module mode
      format: {
        comments: false // Remove comments
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'regenerator-runtime'], // Pre-bundling dependencies
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  }
});
