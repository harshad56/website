import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { apiService } from '@/services/ApiService';
import { queryKeys } from '@/lib/queryClient';
import type { UserProgress, CourseContent, ApiResponse } from '@/services/ApiService';

// Enhanced error type for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Hook for fetching user progress with caching
export const useUserProgress = (userId: string | undefined) => {
  return useQuery({
    queryKey: userId ? queryKeys.user.progress(userId) : ['user', 'progress', 'none'],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await apiService.getUserProgress(userId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch user progress');
      }
      return response.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes - progress updates frequently
  });
};

// Hook for fetching course content
export const useCourseContent = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: async () => {
      const response = await apiService.getCourse(courseId);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch course');
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - course content rarely changes
  });
};

// Hook for fetching all courses (for catalog)
export const useCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.all,
    queryFn: async () => {
      try {
        const response = await apiService.getCourses();
        if (!response.success || !response.data) {
          // Return empty array instead of throwing to prevent UI breakage
          console.warn('Failed to fetch courses, returning empty array');
          return [];
        }
        return response.data;
      } catch (error: any) {
        // If it's a 500 error, return empty array instead of throwing
        if (error?.status >= 500) {
          console.warn('Server error fetching courses, returning empty array:', error);
          return [];
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    // Don't retry on server errors
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook for fetching user's enrolled courses
export const useMyCourses = () => {
  return useQuery({
    queryKey: ['courses', 'my'], // Simple key for now, ideally tied to userId
    queryFn: async () => {
      try {
        const response = await apiService.getMyCourses();
        if (!response.success || !response.data) {
          // Return empty array instead of throwing if just no courses
          return [];
        }
        return response.data;
      } catch (error: any) {
        // If it's a 500 error, return empty array instead of throwing
        // This prevents excessive retries
        if (error?.status >= 500) {
          console.warn('Server error fetching my courses, returning empty array:', error);
          return [];
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    // Don't retry on server errors
    retry: (failureCount, error: any) => {
      if (error?.status >= 500) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook for fetching all projects
export const useProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: async () => {
      const response = await apiService.getProjects();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch projects');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for fetching all study materials
export const useStudyMaterials = () => {
  return useQuery({
    queryKey: queryKeys.studyMaterials.all,
    queryFn: async () => {
      const response = await apiService.getStudyMaterials();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch study materials');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for updating progress with optimistic updates
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, moduleId, topicId }: {
      userId: string;
      moduleId: string;
      topicId?: string;
    }) => {
      const response = await apiService.updateProgress(userId, moduleId, topicId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update progress');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch progress
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.progress(variables.userId)
      });
    },
    // Optimistic update
    onMutate: async ({ userId, moduleId, topicId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.progress(userId)
      });

      // Snapshot previous value
      const previousProgress = queryClient.getQueryData<UserProgress>(
        queryKeys.user.progress(userId)
      );

      // Optimistically update
      if (previousProgress) {
        queryClient.setQueryData<UserProgress>(
          queryKeys.user.progress(userId),
          (old) => {
            if (!old) return old;
            const updated = { ...old };
            if (!updated.completedModules.includes(moduleId)) {
              updated.completedModules = [...updated.completedModules, moduleId];
            }
            if (topicId && !updated.completedTopics.includes(topicId)) {
              updated.completedTopics = [...updated.completedTopics, topicId];
            }
            return updated;
          }
        );
      }

      return { previousProgress };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData(
          queryKeys.user.progress(variables.userId),
          context.previousProgress
        );
      }
    },
  });
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return apiService.login(email, password);
    },
    onSuccess: () => {
      // Invalidate user-related queries after login
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
};

// Hook for signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, name }: {
      email: string;
      password: string;
      name: string;
    }) => {
      return apiService.signup(email, password, name);
    },
    onSuccess: () => {
      // Invalidate user-related queries after signup
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
};

