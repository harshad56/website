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
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide') || id.includes('@radix-ui') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack') || id.includes('framer-motion') || id.includes('date-fns')) {
              return 'libs-vendor';
            }
            return 'vendor';
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
    cssMinify: 'esbuild',
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
