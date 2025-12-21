import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean; // If true, load immediately (for above-the-fold images)
  quality?: number; // Image quality (1-100)
}

/**
 * Optimized image component with:
 * - Lazy loading
 * - WebP format support with fallback
 * - Loading skeleton
 * - Error handling
 * - Responsive sizing
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallback,
  priority = false,
  quality = 80,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setSupportsWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    checkWebPSupport();
  }, []);

  // Generate optimized image URL
  useEffect(() => {
    if (supportsWebP === null) return;

    // If it's an external URL (like Unsplash), try to optimize it
    if (src.includes('unsplash.com') || src.includes('images.unsplash.com')) {
      // Unsplash supports query parameters for optimization
      const url = new URL(src);
      url.searchParams.set('w', width?.toString() || '800');
      url.searchParams.set('q', quality.toString());
      if (supportsWebP) {
        url.searchParams.set('fm', 'webp');
      } else {
        url.searchParams.set('fm', 'jpg');
      }
      url.searchParams.set('fit', 'crop');
      setImageSrc(url.toString());
    } else if (src.startsWith('http')) {
      // For other external URLs, use as-is (could be enhanced with image CDN)
      setImageSrc(src);
    } else {
      // For local images, could add WebP conversion logic here
      setImageSrc(src);
    }
  }, [src, supportsWebP, width, quality]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
  };

  // Show skeleton while loading
  if (isLoading && !priority) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Skeleton 
          className={cn(
            'w-full h-full',
            height ? `h-[${height}px]` : 'aspect-video'
          )}
          style={{ width, height }}
        />
        <img
          src={imageSrc || src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className="hidden"
          {...props}
        />
      </div>
    );
  }

  if (hasError && !fallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc || src || fallback}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
        'max-w-full h-auto', // Mobile responsive
        className
      )}
      style={{
        objectFit: 'cover',
        ...props.style,
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
};


