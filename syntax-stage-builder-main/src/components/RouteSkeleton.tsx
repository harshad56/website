import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { LearningPageSkeleton, CourseCatalogSkeleton, HomePageSkeleton, PageSkeleton } from './PageSkeleton';

/**
 * Route-aware skeleton loader that shows appropriate skeleton based on current route
 * Memoized for performance
 */
export const RouteSkeleton = memo(() => {
  const location = useLocation();
  const path = location.pathname;

  // Homepage - lightweight skeleton
  if (path === '/') {
    return <div className="min-h-screen bg-background" />;
  }

  // Learning pages - lightweight skeleton
  if (path.includes('-learning')) {
    return <LearningPageSkeleton />;
  }

  // Course catalog
  if (path === '/courses' || path === '/course-catalog') {
    return <CourseCatalogSkeleton />;
  }

  // Default skeleton for other pages
  return <PageSkeleton />;
});

RouteSkeleton.displayName = 'RouteSkeleton';


