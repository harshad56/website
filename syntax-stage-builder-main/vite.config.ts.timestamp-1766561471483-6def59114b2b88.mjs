// vite.config.ts
import { defineConfig } from "file:///C:/Users/Harsh/OneDrive/Desktop/syntax-stage-builder-main%20(1)/syntax-stage-builder-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Harsh/OneDrive/Desktop/syntax-stage-builder-main%20(1)/syntax-stage-builder-main/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/Harsh/OneDrive/Desktop/syntax-stage-builder-main%20(1)/syntax-stage-builder-main/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///C:/Users/Harsh/OneDrive/Desktop/syntax-stage-builder-main%20(1)/syntax-stage-builder-main/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Harsh\\OneDrive\\Desktop\\syntax-stage-builder-main (1)\\syntax-stage-builder-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    // Allow network access
    port: 3e3,
    strictPort: true
    // Force port 3000, fail if taken
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Bundle analyzer - only in production builds
    mode === "production" && visualizer({
      filename: "./dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Optimize chunk file names
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    },
    // Enable minification with esbuild (faster than terser)
    minify: "esbuild",
    // Enable source maps in development only
    sourcemap: mode === "development",
    // Optimize asset inlining threshold (smaller files will be inlined)
    assetsInlineLimit: 4096,
    // 4KB - inline smaller assets
    // Target modern browsers for smaller bundles
    target: "esnext",
    // CSS code splitting
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Enable compression
    cssMinify: "esbuild",
    // Chunk size warning limit
    chunkSizeWarningLimit: 1e3
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query"
    ],
    // Exclude large dependencies from pre-bundling (but let Vite handle them)
    exclude: [],
    // Force optimization
    force: false,
    // Esbuild options for faster optimization
    esbuildOptions: {
      target: "esnext",
      // Drop console in production
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : []
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIYXJzaFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHN5bnRheC1zdGFnZS1idWlsZGVyLW1haW4gKDEpXFxcXHN5bnRheC1zdGFnZS1idWlsZGVyLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEhhcnNoXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcc3ludGF4LXN0YWdlLWJ1aWxkZXItbWFpbiAoMSlcXFxcc3ludGF4LXN0YWdlLWJ1aWxkZXItbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSGFyc2gvT25lRHJpdmUvRGVza3RvcC9zeW50YXgtc3RhZ2UtYnVpbGRlci1tYWluJTIwKDEpL3N5bnRheC1zdGFnZS1idWlsZGVyLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjAuMC4wLjBcIiwgLy8gQWxsb3cgbmV0d29yayBhY2Nlc3NcbiAgICBwb3J0OiAzMDAwLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsIC8vIEZvcmNlIHBvcnQgMzAwMCwgZmFpbCBpZiB0YWtlblxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgLy8gQnVuZGxlIGFuYWx5emVyIC0gb25seSBpbiBwcm9kdWN0aW9uIGJ1aWxkc1xuICAgIG1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiB2aXN1YWxpemVyKHtcbiAgICAgIGZpbGVuYW1lOiAnLi9kaXN0L3N0YXRzLmh0bWwnLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gT3B0aW1pemUgY2h1bmsgZmlsZSBuYW1lc1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2NodW5rcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIEVuYWJsZSBtaW5pZmljYXRpb24gd2l0aCBlc2J1aWxkIChmYXN0ZXIgdGhhbiB0ZXJzZXIpXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgLy8gRW5hYmxlIHNvdXJjZSBtYXBzIGluIGRldmVsb3BtZW50IG9ubHlcbiAgICBzb3VyY2VtYXA6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXG4gICAgLy8gT3B0aW1pemUgYXNzZXQgaW5saW5pbmcgdGhyZXNob2xkIChzbWFsbGVyIGZpbGVzIHdpbGwgYmUgaW5saW5lZClcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy8gNEtCIC0gaW5saW5lIHNtYWxsZXIgYXNzZXRzXG4gICAgLy8gVGFyZ2V0IG1vZGVybiBicm93c2VycyBmb3Igc21hbGxlciBidW5kbGVzXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICAvLyBDU1MgY29kZSBzcGxpdHRpbmdcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgLy8gUmVwb3J0IGNvbXByZXNzZWQgc2l6ZVxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlLFxuICAgIC8vIEVuYWJsZSBjb21wcmVzc2lvblxuICAgIGNzc01pbmlmeTogJ2VzYnVpbGQnLFxuICAgIC8vIENodW5rIHNpemUgd2FybmluZyBsaW1pdFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScsXG4gICAgXSxcbiAgICAvLyBFeGNsdWRlIGxhcmdlIGRlcGVuZGVuY2llcyBmcm9tIHByZS1idW5kbGluZyAoYnV0IGxldCBWaXRlIGhhbmRsZSB0aGVtKVxuICAgIGV4Y2x1ZGU6IFtdLFxuICAgIC8vIEZvcmNlIG9wdGltaXphdGlvblxuICAgIGZvcmNlOiBmYWxzZSxcbiAgICAvLyBFc2J1aWxkIG9wdGlvbnMgZm9yIGZhc3RlciBvcHRpbWl6YXRpb25cbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICAgIC8vIERyb3AgY29uc29sZSBpbiBwcm9kdWN0aW9uXG4gICAgICBkcm9wOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcbiAgICB9LFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1YyxTQUFTLG9CQUFvQjtBQUNwZSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsa0JBQWtCO0FBSjNCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQSxFQUNkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBO0FBQUEsSUFFaEIsU0FBUyxnQkFBZ0IsV0FBVztBQUFBLE1BQ2xDLFVBQVU7QUFBQSxNQUNWLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYyxDQUFDLE9BQU87QUFDcEIsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQTtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQTtBQUFBLElBRVIsV0FBVyxTQUFTO0FBQUE7QUFBQSxJQUVwQixtQkFBbUI7QUFBQTtBQUFBO0FBQUEsSUFFbkIsUUFBUTtBQUFBO0FBQUEsSUFFUixjQUFjO0FBQUE7QUFBQSxJQUVkLHNCQUFzQjtBQUFBO0FBQUEsSUFFdEIsV0FBVztBQUFBO0FBQUEsSUFFWCx1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFNBQVMsQ0FBQztBQUFBO0FBQUEsSUFFVixPQUFPO0FBQUE7QUFBQSxJQUVQLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBO0FBQUEsTUFFUixNQUFNLFFBQVEsSUFBSSxhQUFhLGVBQWUsQ0FBQyxXQUFXLFVBQVUsSUFBSSxDQUFDO0FBQUEsSUFDM0U7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
