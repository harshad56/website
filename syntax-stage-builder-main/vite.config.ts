import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Allow network access
    port: 3000,
    strictPort: true, // Force port 3000, fail if taken
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Bundle analyzer - only in production builds
    mode === 'production' && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - aggressive splitting for better caching
          if (id.includes('node_modules')) {
            // React core - critical, load first
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react-core';
            }
            // React Router - separate chunk
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // TanStack Query - separate chunk
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            // Framer Motion - large library, lazy load
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Radix UI components - split by usage
            if (id.includes('@radix-ui')) {
              // Core components used frequently
              if (id.includes('dialog') || id.includes('dropdown') || id.includes('select') || id.includes('tabs')) {
                return 'vendor-radix-core';
              }
              // Less frequently used
              return 'vendor-radix-other';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'vendor-forms';
            }
            // Lucide icons - lazy load, split by usage
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Chart libraries
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            // Date libraries
            if (id.includes('date-fns') || id.includes('react-day-picker')) {
              return 'vendor-dates';
            }
            // All other node_modules
            return 'vendor-misc';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Enable minification with esbuild (faster than terser)
    minify: 'esbuild',
    // Enable source maps in development only
    sourcemap: mode === 'development',
    // Optimize asset inlining threshold (smaller files will be inlined)
    assetsInlineLimit: 4096, // 4KB - inline smaller assets
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Enable compression
    cssMinify: 'lightningcss',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    // Exclude large dependencies from pre-bundling (but let Vite handle them)
    exclude: [],
    // Force optimization
    force: false,
    // Esbuild options for faster optimization
    esbuildOptions: {
      target: 'esnext',
      // Drop console in production
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
}));
