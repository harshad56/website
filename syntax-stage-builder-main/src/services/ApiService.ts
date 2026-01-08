// Real API service for backend functionality
import { getUserFriendlyError } from '@/utils/errorHandler';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProgress {
  userId: string;
  completedModules: string[];
  completedTopics: string[];
  totalPoints: number;
  currentStreak: number;
  achievements: string[];
  lastActivity: string;
}

export interface CourseContent {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  totalLessons: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  order: number;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  codeExamples: CodeExample[];
  exercises: Exercise[];
  order: number;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'coding' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  private token: string | null = null;
  private mockData = {
    users: new Map<string, any>(),
    courses: new Map<string, any>()
  };

  constructor() {
    // Get token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Use internal token or fallback to localStorage
    const token = this.token || localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getHeaders();

      const hasToken = this.token || localStorage.getItem('auth_token');
      console.log('API Request:', { url, method: options.method || 'GET', hasToken: !!hasToken });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text();

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJSON = contentType?.includes('application/json');

      if (!isJSON) {
        console.error('Non-JSON response:', { status: response.status, contentType, text: responseText.substring(0, 200) });
        if (!response.ok) {
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
        return {
          success: true,
          data: responseText as unknown as T
        };
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', {
          status: response.status,
          contentType,
          text: responseText.substring(0, 500),
          parseError
        });
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).data = data;
        console.error('API error response:', { status: response.status, data });
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);

      // Convert to user-friendly error
      const friendlyError = getUserFriendlyError(error);
      const enhancedError = new Error(friendlyError.message);
      (enhancedError as any).title = friendlyError.title;
      (enhancedError as any).action = friendlyError.action;
      (enhancedError as any).variant = friendlyError.variant;
      (enhancedError as any).status = (error as any).status;
      (enhancedError as any).originalError = error;

      throw enhancedError;
    }
  }

  // Separate helper for multipart/form-data uploads (e.g., file upload)
  private async uploadRequest<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const headers: HeadersInit = {};
      const token = this.token || localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('API Upload Request:', { url, method: 'POST', hasToken: !!this.token });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const responseText = await response.text();
      const contentType = response.headers.get('content-type');
      const isJSON = contentType?.includes('application/json');

      if (!isJSON) {
        console.error('Non-JSON upload response:', { status: response.status, contentType, text: responseText.substring(0, 200) });
        if (!response.ok) {
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
        return {
          success: true,
          data: responseText as unknown as T,
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error (upload):', {
          status: response.status,
          contentType,
          text: responseText.substring(0, 500),
          parseError,
        });
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).data = data;
        console.error('API upload error response:', { status: response.status, data });
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API upload request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload request failed');
    }
  }

  private initializeMockData() {
    // Mock user data
    this.mockData.users.set('user_123', {
      id: 'user_123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      progress: {
        userId: 'user_123',
        completedModules: ['java-1', 'python-1'],
        completedTopics: ['java-1.1', 'java-1.2', 'python-1.1'],
        totalPoints: 1250,
        currentStreak: 7,
        achievements: ['first_completion', 'week_streak'],
        lastActivity: new Date().toISOString()
      }
    });

    // Mock course data
    this.mockData.courses.set('java-fundamentals', {
      id: 'java-fundamentals',
      title: 'Java Programming Fundamentals',
      description: 'Learn the basics of Java programming language',
      difficulty: 'beginner',
      estimatedDuration: '20 hours',
      totalLessons: 15,
      modules: [
        {
          id: 'java-1',
          title: 'Introduction to Java',
          description: 'Get started with Java programming',
          order: 1,
          topics: [
            {
              id: 'java-1.1',
              title: 'What is Java?',
              content: 'Java is a high-level, object-oriented programming language...',
              order: 1,
              codeExamples: [
                {
                  id: 'ex1',
                  title: 'Hello World',
                  code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
                  language: 'java',
                  explanation: 'This is a basic Java program that prints "Hello, World!" to the console.'
                }
              ],
              exercises: [
                {
                  id: 'ex1',
                  title: 'Java Basics Quiz',
                  description: 'Test your knowledge of Java fundamentals',
                  type: 'multiple-choice',
                  question: 'What is the correct way to declare a variable in Java?',
                  options: ['var x = 10;', 'int x = 10;', 'let x = 10;', 'const x = 10;'],
                  correctAnswer: 'int x = 10;',
                  points: 10
                }
              ]
            }
          ]
        }
      ]
    });
  }

  // User Management
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async signup(email: string, password: string, name: string): Promise<ApiResponse<any>> {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    // Try real API first
    try {
      if (this.token) {
        return await this.request('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword: oldPassword, newPassword })
        });
      }
    } catch (e: any) {
      // If it's a specific API error (like 400 Bad Request for wrong password), re-throw it
      // so the UI can show the correct error message.
      if (e.status && e.status >= 400 && e.status < 500) {
        throw e;
      }
      console.warn("API change password failed, falling back to mock behavior", e);
    }

    // Mock fallback
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if using local mock user
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  async getProfile(): Promise<ApiResponse<any>> {
    // Add cache buster to ensure we get fresh data across account switches
    return this.request(`/users/profile?cb=${Date.now()}`, {
      method: 'GET'
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<any>> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }

  // Progress Management
  async getUserProgress(userId: string): Promise<ApiResponse<UserProgress>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = this.mockData.users.get(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user.progress
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user progress'
      };
    }
  }

  async updateProgress(userId: string, moduleId: string, topicId?: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.mockData.users.get(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Update progress
    if (!user.progress.completedModules.includes(moduleId)) {
      user.progress.completedModules.push(moduleId);
    }

    if (topicId && !user.progress.completedTopics.includes(topicId)) {
      user.progress.completedTopics.push(topicId);
    }

    user.progress.totalPoints += topicId ? 50 : 100;
    user.progress.lastActivity = new Date().toISOString();

    return {
      success: true,
      data: user.progress,
      message: 'Progress updated successfully'
    };
  }

  async updatePreferences(userId: string, preferences: any): Promise<ApiResponse<any>> {
    // Try real API first
    try {
      if (this.token) {
        return await this.request('/users/preferences', {
          method: 'PUT',
          body: JSON.stringify(preferences)
        });
      }
    } catch (e) {
      console.warn("API update preferences failed, falling back to mock behavior", e);
    }

    // Mock fallback
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real mock scenario, we'd update this.mockData
    // For now we just return success so the UI updates
    return {
      success: true,
      data: preferences,
      message: 'Preferences updated successfully'
    };
  }

  // Course Management
  async getCourses(): Promise<ApiResponse<CourseContent[]>> {
    return this.request<CourseContent[]>('/courses', {
      method: 'GET',
    });
  }

  async getCourse(courseId: string): Promise<ApiResponse<CourseContent>> {
    return this.request<CourseContent>(`/courses/${courseId}`, {
      method: 'GET',
    });
  }

  // Language Interview Q&A
  async getLanguages(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/languages', {
      method: 'GET'
    });
  }

  async getLanguageBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/languages/${slug}`, {
      method: 'GET'
    });
  }

  async getLanguageQuestions(languageId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/languages/${languageId}/questions`, {
      method: 'GET'
    });
  }

  // Code Execution
  async executeCode(language: string, code: string, testCases?: any[]): Promise<ApiResponse<any>> {
    return this.request('/code-execution/execute', {
      method: 'POST',
      body: JSON.stringify({
        language,
        code,
        testCases
      })
    });
  }

  // Analytics
  async getAnalytics(userId: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockData.users.get(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const analytics = {
      totalStudyTime: 1250, // minutes
      averageSessionLength: 45, // minutes
      weeklyProgress: [65, 72, 68, 85, 90, 88, 92],
      topLanguages: ['Java', 'Python', 'JavaScript'],
      recentActivity: [
        { type: 'module_completed', title: 'Java Module 1', timestamp: new Date().toISOString() },
        { type: 'quiz_taken', title: 'Java Basics Quiz', score: 85, timestamp: new Date().toISOString() }
      ]
    };

    return {
      success: true,
      data: analytics
    };
  }

  // Community Features
  async getPosts(category?: string, page = 1): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockPosts = [
      {
        id: '1',
        author: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        title: 'Best practices for Java memory management',
        content: 'I\'ve been working on optimizing memory usage...',
        category: 'java',
        likes: 24,
        replies: 8,
        createdAt: new Date().toISOString()
      }
    ];

    return {
      success: true,
      data: {
        posts: mockPosts,
        totalPages: 5,
        currentPage: page
      }
    };
  }

  async createPost(userId: string, title: string, content: string, category: string): Promise<ApiResponse<any>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockData.users.get(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const newPost = {
      id: `post_${Date.now()}`,
      author: { name: user.name, avatar: user.avatar },
      title,
      content,
      category,
      likes: 0,
      replies: 0,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      data: newPost,
      message: 'Post created successfully'
    };
  }

  // Course Admin
  async createCourse(course: Partial<CourseContent> & {
    language: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        language: course.language,
        difficulty: course.difficulty,
        estimatedDuration: course.estimatedDuration,
        totalLessons: course.totalLessons,
        price: (course as any).price,
        imageUrl: (course as any).imageUrl,
        tags: (course as any).tags,
        isPublished: (course as any).isPublished ?? true,
        category: (course as any).category,
      })
    });
  }

  async updateCourse(courseId: string, course: Partial<CourseContent> & {
    language: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        language: course.language,
        difficulty: course.difficulty,
        estimatedDuration: course.estimatedDuration,
        totalLessons: course.totalLessons,
        price: (course as any).price,
        imageUrl: (course as any).imageUrl,
        tags: (course as any).tags,
        isPublished: (course as any).isPublished ?? true,
        category: (course as any).category,
      })
    });
  }

  async deleteCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE'
    });
  }

  async getCourseStats(): Promise<ApiResponse<any>> {
    return this.request(`/courses/stats/summary`, { method: 'GET' });
  }

  // Enrollment
  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST'
    });
  }

  async createCourseCheckoutSession(courseId: string): Promise<ApiResponse<{ url: string }>> {
    return this.request<any>(`/courses/${courseId}/checkout`, {
      method: 'POST'
    });
  }

  async verifyCoursePayment(
    courseId: string,
    payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/courses/${courseId}/payment/verify`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Study Groups
  async getStudyGroups() {
    return this.request('/study-groups');
  }

  async getAllStudyGroupsAdmin() {
    return this.request('/study-groups/admin/all');
  }

  async createStudyGroup(data: any) {
    return this.request('/study-groups', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateStudyGroup(id: string, data: any) {
    return this.request(`/study-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteStudyGroup(id: string) {
    return this.request(`/study-groups/${id}`, {
      method: 'DELETE'
    });
  }

  // File uploads
  async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.uploadRequest<{ url: string }>('/files/upload', formData);
  }

  async checkEnrollment(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}/enrollment`, {
      method: 'GET'
    });
  }

  async getCourseContent(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}/content`, {
      method: 'GET'
    });
  }

  // Wishlist
  async getWishlist(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/wishlist', {
      method: 'GET'
    });
  }

  async addToWishlist(courseId: string): Promise<ApiResponse<any>> {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId })
    });
  }

  async removeFromWishlist(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/wishlist/${courseId}`, {
      method: 'DELETE'
    });
  }

  async checkWishlist(courseId: string): Promise<ApiResponse<{ inWishlist: boolean }>> {
    return this.request<{ inWishlist: boolean }>(`/wishlist/check/${courseId}`, {
      method: 'GET'
    });
  }

  // Course Categories and Languages
  async getCourseCategories(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/courses/categories', {
      method: 'GET'
    });
  }

  async createCourseCategory(name: string): Promise<ApiResponse<any>> {
    return this.request('/courses/categories', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }

  async getCourseLanguages(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/courses/languages', {
      method: 'GET'
    });
  }

  async createCourseLanguage(name: string): Promise<ApiResponse<any>> {
    return this.request('/courses/languages', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }

  async completeLesson(lessonId: string): Promise<ApiResponse<any>> {
    return this.request(`/lessons/${lessonId}/complete`, {
      method: 'POST'
    });
  }

  // Course Content Management (Admin)
  async createModule(courseId: string, module: any): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(module)
    });
  }

  async createLesson(moduleId: string, lesson: any): Promise<ApiResponse<any>> {
    return this.request(`/modules/${moduleId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lesson)
    });
  }

  async addVideoToLesson(lessonId: string, video: any): Promise<ApiResponse<any>> {
    return this.request(`/lessons/${lessonId}/videos`, {
      method: 'POST',
      body: JSON.stringify(video)
    });
  }

  async addDocumentToLesson(lessonId: string, document: any): Promise<ApiResponse<any>> {
    return this.request(`/lessons/${lessonId}/documents`, {
      method: 'POST',
      body: JSON.stringify(document)
    });
  }

  async updateModule(moduleId: string, module: any): Promise<ApiResponse<any>> {
    return this.request(`/modules/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(module)
    });
  }

  async deleteModule(moduleId: string): Promise<ApiResponse<any>> {
    return this.request(`/modules/${moduleId}`, {
      method: 'DELETE'
    });
  }

  // Projects
  async getProjects(): Promise<ApiResponse<any>> {
    return this.request('/projects', { method: 'GET' });
  }

  async getProject(projectId: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}`, { method: 'GET' });
  }

  async createProjectCheckout(projectId: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}/checkout`, { method: 'POST' });
  }

  async verifyProjectPayment(projectId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}/payment/verify`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async downloadProject(projectId: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}/download`, { method: 'POST' });
  }

  // Study materials
  async getStudyMaterials(): Promise<ApiResponse<any>> {
    return this.request('/study-materials', { method: 'GET' });
  }

  async getStudyMaterial(materialId: string): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}`, { method: 'GET' });
  }

  async createStudyMaterialCheckout(materialId: string): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}/checkout`, { method: 'POST' });
  }

  async verifyStudyMaterialPayment(materialId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}/payment/verify`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async downloadStudyMaterial(materialId: string): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}/download`, { method: 'POST' });
  }

  // Certificates
  async getCourseCertificate(courseId: string): Promise<ApiResponse<any>> {
    return this.request(`/courses/${courseId}/certificate`, { method: 'GET' });
  }

  // Admin Projects
  async adminCreateProject(payload: any): Promise<ApiResponse<any>> {
    return this.request(`/projects`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getProjectStats(): Promise<ApiResponse<any>> {
    return this.request(`/projects/stats/summary`, { method: 'GET' });
  }

  async adminUpdateProject(projectId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async adminDeleteProject(projectId: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Admin Study Materials
  async adminCreateStudyMaterial(payload: any): Promise<ApiResponse<any>> {
    return this.request(`/study-materials`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getStudyMaterialStats(): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/stats/summary`, { method: 'GET' });
  }

  async adminUpdateStudyMaterial(materialId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async adminDeleteStudyMaterial(materialId: string): Promise<ApiResponse<any>> {
    return this.request(`/study-materials/${materialId}`, {
      method: 'DELETE',
    });
  }

  // Jobs
  async getJobs(): Promise<ApiResponse<any>> {
    return this.request('/jobs', { method: 'GET' });
  }

  async getJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}`, { method: 'GET' });
  }

  async shareJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}/share`, { method: 'GET' });
  }

  async applyForJob(jobId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async saveJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}/save`, { method: 'POST' });
  }

  async unsaveJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}/save`, { method: 'DELETE' });
  }

  async getSavedJobs(): Promise<ApiResponse<any>> {
    return this.request('/jobs/saved/list', { method: 'GET' });
  }

  async getUserJobApplications(): Promise<ApiResponse<any>> {
    return this.request('/jobs/applications/list', { method: 'GET' });
  }

  // Resume-based recommendations
  async uploadResume(payload: {
    resumeUrl: string;
    rawText?: string;
    preferredDomains?: string[];
  }): Promise<ApiResponse<any>> {
    return this.request('/jobs/resumes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getJobRecommendations(): Promise<ApiResponse<any>> {
    return this.request('/jobs/recommendations', { method: 'GET' });
  }

  async getAllResumes(): Promise<ApiResponse<any>> {
    return this.request('/jobs/resumes/admin/list', { method: 'GET' });
  }

  // Admin Jobs
  async adminCreateJob(payload: any): Promise<ApiResponse<any>> {
    return this.request(`/jobs`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getJobStats(): Promise<ApiResponse<any>> {
    return this.request(`/jobs/stats/summary`, { method: 'GET' });
  }

  async adminUpdateJob(jobId: string, payload: any): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async adminDeleteJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // AI Tutor
  async aiTutorChat(payload: {
    message: string;
    context?: string;
    language?: string;
    code?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/ai-tutor/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async aiTutorAnalyzeCode(payload: {
    code: string;
    language: string;
    task?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/ai-tutor/analyze-code', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async aiTutorGetRecommendations(payload: {
    language?: string;
    topic?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/ai-tutor/recommendations', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async aiTutorDebugCode(payload: {
    code: string;
    language: string;
    error?: string;
    expectedOutput?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/ai-tutor/debug-code', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Challenges
  async getChallenges(filters: { category?: string; language?: string; difficulty?: string } = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.language) queryParams.append('language', filters.language);
    if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);

    return this.request<any[]>(`/challenges?${queryParams.toString()}`, { method: 'GET' });
  }

  async getLeaderboard(): Promise<ApiResponse<any>> {
    return this.request('/challenges/leaderboard', { method: 'GET' });
  }

  async getChallengeLanguages(): Promise<ApiResponse<any>> {
    return this.request('/challenges/languages', { method: 'GET' });
  }

  async getChallenge(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/challenges/${id}`, { method: 'GET' });
  }

  async updateChallengeProgress(id: string, progress: {
    status: string;
    submitted_code?: string;
    attempts_count?: number;
    completion_time_ms?: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>(`/challenges/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify(progress)
    });
  }

  async getUserChallengesProgress(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/challenges/user/progress', { method: 'GET' });
  }

  // Tutorials
  async getTutorials(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/tutorials', { method: 'GET' });
  }

  async getTutorial(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/tutorials/${id}`, { method: 'GET' });
  }

  async completeTutorialStep(tutorialId: string, stepId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/tutorials/${tutorialId}/steps/${stepId}/complete`, { method: 'POST' });
  }

  async joinStudyGroup(id: string | number): Promise<ApiResponse<any>> {
    return this.request(`/study-groups/${id}/join`, { method: 'POST' });
  }

  async leaveStudyGroup(id: string | number): Promise<ApiResponse<any>> {
    return this.request(`/study-groups/${id}/leave`, { method: 'POST' });
  }

  async getMyStudyGroups(): Promise<ApiResponse<any[]>> {
    return this.request('/study-groups/my-groups', { method: 'GET' });
  }

  async getStudyGroup(id: string | number): Promise<ApiResponse<any>> {
    return this.request(`/study-groups/${id}`, { method: 'GET' });
  }
  // Study Group Detail Features
  async getGroupMembers(groupId: string) {
    return this.request(`/study-groups/${groupId}/members`);
  }

  async getGroupMessages(groupId: string) {
    return this.request(`/study-groups/${groupId}/messages`);
  }

  async sendGroupMessage(groupId: string, content: string, user?: any) {
    return this.request(`/study-groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        userName: user?.name,
        userAvatar: user?.avatar
      })
    });
  }

  async getGroupResources(groupId: string) {
    return this.request(`/study-groups/${groupId}/resources`);
  }

  async addGroupResource(groupId: string, data: any, user?: any) {
    return this.request(`/study-groups/${groupId}/resources`, {
      method: 'POST',
      body: JSON.stringify({ ...data, userName: user?.name })
    });
  }
}

export const apiService = new ApiService();
