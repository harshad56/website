import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css'; // Keep CSS import - Vite handles it efficiently
import { queryClient } from '@/lib/queryClient';

// Defer ALL non-critical code - don't block initial render
if (typeof window !== 'undefined') {
  // Polyfill for requestIdleCallback
  const idleCallback = window.requestIdleCallback || ((cb: IdleRequestCallback) => {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  });

  // Warm up code executor in background (after page is fully loaded)
  window.addEventListener('load', () => {
    setTimeout(() => {
      idleCallback(() => {
        import('@/services/CodeExecutor').then(({ codeExecutor }) => {
          codeExecutor.warmUp();
        }).catch(() => {
          // Silently fail if CodeExecutor doesn't exist
        });
      }, { timeout: 5000 });
    }, 2000);
  });

  // DevTools will be loaded inside App component where QueryClientProvider context is available
}

// Render immediately - don't wait for anything
// Prefetch likely next routes in background (non-blocking)
if (typeof window !== 'undefined') {
  const prefetchRoutes = () => {
    const routes = ['/python-learning', '/javascript-learning', '/courses'];
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  };
  
  // Use requestIdleCallback if available, otherwise setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchRoutes, { timeout: 2000 });
  } else {
    setTimeout(prefetchRoutes, 2000);
  }
}

// Render app immediately
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);




