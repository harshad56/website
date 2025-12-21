import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to prefetch routes on link hover for instant navigation
 */
export const usePrefetch = (route: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prefetch route when component mounts (if visible)
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [route]);
};

/**
 * Hook to prefetch route on hover
 */
export const usePrefetchOnHover = (route: string) => {
  const handleMouseEnter = () => {
    // Prefetch route on hover
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  };

  return { onMouseEnter: handleMouseEnter };
};


