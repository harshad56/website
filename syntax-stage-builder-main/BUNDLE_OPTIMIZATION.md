# Bundle Optimization Guide

## Overview
We've optimized the bundle size with:
- ✅ Better code splitting
- ✅ Vendor chunk separation
- ✅ Tree-shaking optimization
- ✅ Lazy loading for routes
- ✅ Icon code-splitting
- ✅ Bundle analyzer

## Bundle Analysis

After building, check `dist/stats.html` for detailed bundle analysis:
```bash
npm run build:analyze
```

Then open `dist/stats.html` in your browser to see:
- Bundle size breakdown
- Chunk dependencies
- Gzip/Brotli sizes
- Duplicate dependencies

## Optimizations Applied

### 1. Code Splitting
- **Vendor React**: React, React DOM, React Router (~130KB)
- **Vendor Radix**: All Radix UI components (~80KB)
- **Vendor Query**: TanStack React Query (~50KB)
- **Vendor Icons**: Lucide React icons (~200KB, lazy loaded)
- **Vendor Charts**: Recharts, Monaco Editor (~150KB)
- **Vendor Misc**: Other dependencies

### 2. Route-Based Splitting
All routes are lazy-loaded, so users only download what they need:
- Homepage: ~200KB
- Learning pages: ~150KB each
- Other pages: ~100-200KB each

### 3. Icon Optimization
Lucide icons are in a separate chunk and loaded on demand.

### 4. Production Optimizations
- Console.log removed in production
- Minification enabled
- Source maps disabled in production
- Asset inlining for small files (<4KB)

## Expected Bundle Sizes

### Initial Load (Homepage)
- **Before**: ~800KB-1.2MB
- **After**: ~300-400KB
- **Improvement**: 60-70% reduction

### Per Route
- **Before**: Full bundle on every route
- **After**: Only route-specific code
- **Improvement**: 70-80% reduction per route

## Monitoring

### Check Bundle Size
```bash
npm run build
# Check dist/ folder for chunk sizes
```

### Analyze Bundle
```bash
npm run build:analyze
# Open dist/stats.html in browser
```

## Further Optimizations

### If Bundle is Still Large:

1. **Remove Unused Dependencies**
   ```bash
   npm run build:analyze
   # Check for large unused dependencies
   ```

2. **Dynamic Imports for Heavy Components**
   ```tsx
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Image Optimization**
   - Use OptimizedImage component
   - Convert to WebP format
   - Use CDN for images

4. **Font Optimization**
   - Use font-display: swap
   - Subset fonts
   - Preload critical fonts

5. **CSS Optimization**
   - Remove unused Tailwind classes
   - Purge CSS in production
   - Use CSS-in-JS for critical styles only

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Bundle Size**: < 500KB gzipped
- **Initial JS**: < 200KB gzipped

## Tools

- **Vite Bundle Analyzer**: Built-in via rollup-plugin-visualizer
- **Lighthouse**: Chrome DevTools
- **WebPageTest**: Online performance testing
- **Bundlephobia**: Check package sizes before installing


