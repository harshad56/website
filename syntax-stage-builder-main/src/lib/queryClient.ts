import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults for performance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 10 minutes (longer cache = fewer requests)
      staleTime: 10 * 60 * 1000,
      // Keep unused data in cache for 30 minutes (longer = better performance)
      gcTime: 30 * 60 * 1000, // Previously cacheTime
      // Retry failed requests with smart retry logic
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay increases exponentially with jitter
      retryDelay: (attemptIndex) => {
        const baseDelay = 1000 * 2 ** attemptIndex;
        const jitter = Math.random() * 1000;
        return Math.min(baseDelay + jitter, 30000);
      },
      // Don't refetch on window focus (reduces unnecessary requests)
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Refetch on reconnect (important for offline recovery)
      refetchOnReconnect: true,
      // Network mode: retry when offline
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once (for network errors only)
      retry: (failureCount, error) => {
        // Only retry network errors, not validation errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 1;
      },
      // Retry delay for mutations
      retryDelay: 1000,
      // Network mode: retry when offline
      networkMode: 'online',
    },
  },
});

// Query key factory for better organization
export const queryKeys = {
  // User queries
  user: {
    all: ['user'] as const,
    profile: (userId: string) => ['user', userId] as const,
    progress: (userId: string) => ['user', userId, 'progress'] as const,
  },
  // Course queries
  courses: {
    all: ['courses'] as const,
    detail: (courseId: string) => ['courses', courseId] as const,
    modules: (courseId: string) => ['courses', courseId, 'modules'] as const,
    topics: (courseId: string, moduleId: string) => 
      ['courses', courseId, 'modules', moduleId, 'topics'] as const,
  },
  // Job queries
  jobs: {
    all: ['jobs'] as const,
    detail: (jobId: string) => ['jobs', jobId] as const,
    search: (filters: Record<string, any>) => ['jobs', 'search', filters] as const,
  },
  // Project queries
  projects: {
    all: ['projects'] as const,
    detail: (projectId: string) => ['projects', projectId] as const,
    featured: () => ['projects', 'featured'] as const,
  },
};

