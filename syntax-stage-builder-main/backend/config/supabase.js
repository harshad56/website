const { createClient } = require('@supabase/supabase-js');
const winston = require('winston');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only require Supabase in production, allow development without it
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseServiceKey)) {
    winston.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
    winston.warn('Supabase configuration not found. Some features may not work. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for full functionality.');
}

// Only create Supabase client if credentials are provided
const supabase = (supabaseUrl && supabaseServiceKey) ?
    createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }) :
    null;

// Test database connection
const testConnection = async () => {
    if (!supabase) {
        winston.warn('Supabase not configured. Skipping connection test.');
        return true; // Allow server to start without Supabase in development
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            winston.error('Supabase connection test failed:', error);
            // Don't exit in development mode
            if (process.env.NODE_ENV === 'production') {
                return false;
            }
            return true; // Allow development to continue
        }

        winston.info('Supabase connection successful');
        return true;
    } catch (error) {
        winston.error('Supabase connection error:', error);
        // Don't exit in development mode
        if (process.env.NODE_ENV === 'production') {
            return false;
        }
        return true; // Allow development to continue
    }
};

// Database operations helper functions
const db = {
    // User operations
    async createUser(userData) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserById(id) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getUserByEmail(email) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data;
    },

    async getUserByStripeCustomerId(stripeCustomerId) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('stripe_customer_id', stripeCustomerId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data;
    },

    async updateUser(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteUser(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Course operations
    async getCourses() {
        // Get courses with enrollment counts
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (coursesError) throw coursesError;
        if (!courses || courses.length === 0) return [];

        // Get enrollment counts per course
        const courseIds = courses.map(c => c.id);
        const { data: enrollments, error: enrollmentsError } = await supabase
            .from('user_course_enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        if (enrollmentsError) {
            winston.warn('Failed to fetch enrollment counts:', enrollmentsError);
            // Return courses without counts if enrollment query fails
            return courses.map(c => ({ ...c, students_count: 0 }));
        }

        // Count enrollments per course
        const enrollmentCounts = enrollments.reduce((acc, e) => {
            acc[e.course_id] = (acc[e.course_id] || 0) + 1;
            return acc;
        }, {});

        // Get ratings and reviews per course
        const { data: reviews, error: reviewsError } = await supabase
            .from('course_reviews')
            .select('course_id, rating')
            .in('course_id', courseIds);

        if (reviewsError) {
            winston.warn('Failed to fetch reviews:', reviewsError);
        }

        // Calculate average rating and review count per course
        const ratingData = (reviews || []).reduce((acc, r) => {
            if (!acc[r.course_id]) {
                acc[r.course_id] = { total: 0, count: 0 };
            }
            acc[r.course_id].total += r.rating;
            acc[r.course_id].count += 1;
            return acc;
        }, {});

        // Get lesson counts per course
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('id, course_id')
            .in('course_id', courseIds);

        const moduleIds = (modules || []).map(m => m.id);
        let lessonCounts = {};
        let lessonLists = {};

        if (moduleIds.length > 0) {
            const { data: lessons, error: lessonsError } = await supabase
                .from('course_lessons')
                .select('id, module_id, title, order_index')
                .in('module_id', moduleIds)
                .eq('is_published', true)
                .order('order_index', { ascending: true });

            if (!lessonsError && lessons) {
                // Group lessons by course_id via module_id
                const moduleToCourse = {};
                (modules || []).forEach(m => {
                    moduleToCourse[m.id] = m.course_id;
                });

                lessons.forEach(lesson => {
                    const courseId = moduleToCourse[lesson.module_id];
                    if (courseId) {
                        if (!lessonCounts[courseId]) {
                            lessonCounts[courseId] = 0;
                            lessonLists[courseId] = [];
                        }
                        lessonCounts[courseId]++;
                        lessonLists[courseId].push({
                            id: lesson.id,
                            title: lesson.title,
                            order_index: lesson.order_index
                        });
                    }
                });
            }
        }

        // Add students_count, rating, reviews_count, lesson_count, and lessons to each course
        return courses.map(course => {
            const ratingInfo = ratingData[course.id];
            const avgRating = ratingInfo && ratingInfo.count > 0
                ? Math.round((ratingInfo.total / ratingInfo.count) * 10) / 10
                : 4.8; // Default rating if no reviews
            const reviewCount = ratingInfo ? ratingInfo.count : 0;

            return {
                ...course,
                students_count: enrollmentCounts[course.id] || 0,
                rating: avgRating,
                reviews_count: reviewCount,
                lesson_count: lessonCounts[course.id] || 0,
                lessons: (lessonLists[course.id] || []).sort((a, b) => a.order_index - b.order_index)
            };
        });
    },

    async getCourseById(id) {
        const { data, error } = await supabase
            .from('courses')
            .select(`
        *,
        modules (
          *,
          topics (
            *,
            code_examples (*),
            exercises (*)
          )
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async getCourseStats() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        // Fetch courses and enrollments with joined course price
        const [coursesRes, enrollmentsRes] = await Promise.all([
            supabase.from('courses').select('id,is_published,price'),
            supabase
                .from('user_course_enrollments')
                .select('payment_status, course_id, courses ( price )')
        ]);

        if (coursesRes.error) throw coursesRes.error;
        if (enrollmentsRes.error) throw enrollmentsRes.error;

        const courses = coursesRes.data || [];
        const enrollments = enrollmentsRes.data || [];

        const totalCourses = courses.length;
        const publishedCourses = courses.filter((c) => c.is_published !== false).length;
        const totalEnrollments = enrollments.length;
        const paidEnrollments = enrollments.filter((e) => (e.payment_status || '').toLowerCase() === 'paid').length;

        // Revenue: sum price from joined course when payment_status is paid
        const revenue = enrollments.reduce((sum, e) => {
            const status = (e.payment_status || '').toLowerCase();
            if (status === 'paid') {
                const price = e.courses?.price || 0;
                return sum + Number(price || 0);
            }
            return sum;
        }, 0);

        return { totalCourses, publishedCourses, totalEnrollments, paidEnrollments, revenue };
    },

    async createCourse(courseData) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }

        try {
            // Remove any fields that might not exist in the schema
            // Only keep fields that match the current courses table schema
            const allowedFields = [
                'title', 'description', 'language', 'difficulty',
                'estimated_duration', 'total_lessons', 'is_published', 'created_by',
                'image_url', 'price', 'tags', 'category' // Optional fields (add via migration if needed)
            ];

            const cleanCourseData = {};
            for (const key of allowedFields) {
                if (courseData.hasOwnProperty(key)) {
                    cleanCourseData[key] = courseData[key];
                }
            }

            winston.info('Inserting course with fields:', Object.keys(cleanCourseData));

            const { data, error } = await supabase
                .from('courses')
                .insert([cleanCourseData])
                .select()
                .single();

            if (error) {
                winston.error('Supabase createCourse error:', {
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                    courseData: cleanCourseData
                });
                throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
            }

            winston.info('Course created successfully:', data.id);
            return data;
        } catch (error) {
            winston.error('createCourse failed:', error);
            throw error;
        }
    },

    async updateCourse(id, courseData) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }

        try {
            const allowedFields = [
                'title', 'description', 'language', 'difficulty',
                'estimated_duration', 'total_lessons', 'is_published',
                'image_url', 'price', 'tags', 'category'
            ];

            const cleanCourseData = {};
            for (const key of allowedFields) {
                if (courseData.hasOwnProperty(key)) {
                    cleanCourseData[key] = courseData[key];
                }
            }

            // Add updated_at timestamp
            cleanCourseData.updated_at = new Date().toISOString();

            winston.info('Updating course:', id, 'with fields:', Object.keys(cleanCourseData));

            const { data, error } = await supabase
                .from('courses')
                .update(cleanCourseData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                winston.error('Supabase updateCourse error:', {
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    courseId: id
                });
                throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
            }

            winston.info('Course updated successfully:', id);
            return data;
        } catch (error) {
            winston.error('updateCourse failed:', error);
            throw error;
        }
    },

    async deleteCourse(id) {
        if (!supabase) {
            throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
        }

        try {
            winston.info('Deleting course:', id);

            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);

            if (error) {
                winston.error('Supabase deleteCourse error:', {
                    error: error.message,
                    code: error.code,
                    details: error.details,
                    courseId: id
                });
                throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
            }

            winston.info('Course deleted successfully:', id);
            return true;
        } catch (error) {
            winston.error('deleteCourse failed:', error);
            throw error;
        }
    },

    // Enrollment operations
    async createEnrollment(enrollmentData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('user_course_enrollments')
                .insert([enrollmentData])
                .select()
                .single();

            if (error) {
                winston.error('Supabase createEnrollment error:', error);
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        } catch (error) {
            winston.error('createEnrollment failed:', error);
            throw error;
        }
    },

    async getEnrollment(userId, courseId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('user_course_enrollments')
                .select('*')
                .eq('user_id', userId)
                .eq('course_id', courseId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            winston.error('getEnrollment failed:', error);
            throw error;
        }
    },

    async getCourseContent(courseId, userId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            // Get course
            const { data: course, error: courseError } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single();

            if (courseError) throw courseError;

            // Get modules
            const { data: modules, error: modulesError } = await supabase
                .from('modules')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });

            if (modulesError) throw modulesError;

            // Get lessons for each module
            const modulesWithLessons = await Promise.all(
                (modules || []).map(async (module) => {
                    const { data: lessons, error: lessonsError } = await supabase
                        .from('course_lessons')
                        .select('*')
                        .eq('module_id', module.id)
                        .order('order_index', { ascending: true });

                    if (lessonsError) throw lessonsError;

                    // Get videos and documents for each lesson
                    const lessonsWithContent = await Promise.all(
                        (lessons || []).map(async (lesson) => {
                            const [videosResult, documentsResult] = await Promise.all([
                                supabase
                                    .from('course_videos')
                                    .select('*')
                                    .eq('lesson_id', lesson.id)
                                    .single(),
                                supabase
                                    .from('course_documents')
                                    .select('*')
                                    .eq('lesson_id', lesson.id)
                            ]);

                            return {
                                ...lesson,
                                video: videosResult.data,
                                documents: documentsResult.data || []
                            };
                        })
                    );

                    return {
                        ...module,
                        lessons: lessonsWithContent
                    };
                })
            );

            // Collect lesson ids for this course
            const lessonIds = modulesWithLessons
                .flatMap((m) => m.lessons || [])
                .map((l) => l.id)
                .filter(Boolean);

            // Get user progress (only completed lessons for this course)
            let progress = [];
            if (lessonIds.length > 0) {
                const { data: progressData, error: progressError } = await supabase
                    .from('user_lesson_progress')
                    .select('lesson_id')
                    .eq('user_id', userId)
                    .eq('is_completed', true)
                    .in('lesson_id', lessonIds);

                if (progressError) throw progressError;
                progress = progressData || [];
            }

            const completedLessons = (progress || []).map((p) => p.lesson_id);
            const uniqueCompleted = Array.from(new Set(completedLessons));
            const totalLessons = modulesWithLessons.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

            return {
                course,
                modules: modulesWithLessons,
                progress: {
                    completedLessons: uniqueCompleted,
                    totalLessons
                }
            };
        } catch (error) {
            winston.error('getCourseContent failed:', error);
            throw error;
        }
    },

    // Module operations
    async createModule(moduleData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('modules')
                .insert([moduleData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            winston.error('createModule failed:', error);
            throw error;
        }
    },

    async getModuleById(moduleId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .eq('id', moduleId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            winston.error('getModuleById failed:', error);
            throw error;
        }
    },

    async updateModule(moduleId, updates) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('modules')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', moduleId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            winston.error('updateModule failed:', error);
            throw error;
        }
    },

    async deleteModule(moduleId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { error } = await supabase
                .from('modules')
                .delete()
                .eq('id', moduleId);

            if (error) throw error;
            return true;
        } catch (error) {
            winston.error('deleteModule failed:', error);
            throw error;
        }
    },

    // Lesson operations
    async createLesson(lessonData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('course_lessons')
                .insert([lessonData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            winston.error('createLesson failed:', error);
            throw error;
        }
    },

    async getLessonById(lessonId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('course_lessons')
                .select('*')
                .eq('id', lessonId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            winston.error('getLessonById failed:', error);
            throw error;
        }
    },

    // Video operations
    async createVideo(videoData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('course_videos')
                .insert([videoData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            winston.error('createVideo failed:', error);
            throw error;
        }
    },

    // Document operations
    async createDocument(documentData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            const { data, error } = await supabase
                .from('course_documents')
                .insert([documentData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            winston.error('createDocument failed:', error);
            throw error;
        }
    },

    // Lesson progress operations
    async completeLesson(progressData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        try {
            // Check if progress already exists
            const { data: existing } = await supabase
                .from('user_lesson_progress')
                .select('id')
                .eq('user_id', progressData.user_id)
                .eq('lesson_id', progressData.lesson_id)
                .single();

            if (existing) {
                // Update existing progress
                const { data, error } = await supabase
                    .from('user_lesson_progress')
                    .update({
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                        last_accessed_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // Create new progress
                const { data, error } = await supabase
                    .from('user_lesson_progress')
                    .insert([{
                        ...progressData,
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                        last_accessed_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        } catch (error) {
            winston.error('completeLesson failed:', error);
            throw error;
        }
    },

    // Progress operations
    async getUserProgress(userId) {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async updateUserProgress(userId, progressData) {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert([{ user_id: userId, ...progressData }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Course completion summary for certificates
    async getCourseCompletion(userId, courseId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        // Fetch modules for the course
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', courseId);

        if (modulesError) throw modulesError;
        const moduleIds = (modules || []).map((m) => m.id);
        if (moduleIds.length === 0) {
            return { totalLessons: 0, completedLessons: 0 };
        }

        // Fetch lessons for these modules
        const { data: lessons, error: lessonsError } = await supabase
            .from('course_lessons')
            .select('id')
            .in('module_id', moduleIds);

        if (lessonsError) throw lessonsError;
        const lessonIds = (lessons || []).map((l) => l.id);
        const totalLessons = lessonIds.length;
        if (totalLessons === 0) {
            return { totalLessons: 0, completedLessons: 0 };
        }

        // Fetch completed lessons for the user restricted to this course
        const { data: progress, error: progressError } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .eq('is_completed', true)
            .in('lesson_id', lessonIds);

        if (progressError) throw progressError;

        const completedLessons = new Set((progress || []).map((p) => p.lesson_id)).size;

        return { totalLessons, completedLessons };
    },

    // Community operations
    async getPosts(category = null, page = 1, limit = 10) {
        let query = supabase
            .from('posts')
            .select(`
        *,
        author:users(name, avatar)
      `)
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    },

    async createPost(postData) {
        const { data, error } = await supabase
            .from('posts')
            .insert([postData])
            .select(`
        *,
        author:users(name, avatar)
      `)
            .single();

        if (error) throw error;
        return data;
    },

    // Code execution history
    async saveCodeExecution(executionData) {
        const { data, error } = await supabase
            .from('code_executions')
            .insert([executionData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserCodeHistory(userId, limit = 50) {
        const { data, error } = await supabase
            .from('code_executions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    // AI Tutor conversations
    async saveConversation(conversationData) {
        const { data, error } = await supabase
            .from('ai_conversations')
            .insert([conversationData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getConversationHistory(userId, limit = 20) {
        const { data, error } = await supabase
            .from('ai_conversations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    // Study groups
    async createStudyGroup(groupData) {
        const { data, error } = await supabase
            .from('study_groups')
            .insert([groupData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getStudyGroups() {
        const { data, error } = await supabase
            .from('study_groups')
            .select(`
        *,
        members:study_group_members(
          user:users(id, name, avatar)
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Mentorship
    async createMentorshipSession(sessionData) {
        const { data, error } = await supabase
            .from('mentorship_sessions')
            .insert([sessionData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMentorshipSessions(userId) {
        const { data, error } = await supabase
            .from('mentorship_sessions')
            .select(`
        *,
        mentor:users!mentor_id(name, avatar),
        mentee:users!mentee_id(name, avatar)
      `)
            .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Projects
    async getProjects(includeInactive = false) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        let query = supabase
            .from('projects')
            .select('*');

        // If not including inactive, filter to only active projects
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        // Get download counts for each project
        if (data && data.length > 0) {
            const projectIds = data.map(p => p.id);

            // Get download counts grouped by project_id
            const { data: downloadsData, error: downloadsError } = await supabase
                .from('project_downloads')
                .select('project_id')
                .in('project_id', projectIds);

            if (!downloadsError && downloadsData) {
                // Count downloads per project
                const downloadCounts = downloadsData.reduce((acc, download) => {
                    acc[download.project_id] = (acc[download.project_id] || 0) + 1;
                    return acc;
                }, {});

                // Add download count to each project
                return data.map(project => ({
                    ...project,
                    total_downloads: downloadCounts[project.id] || 0
                }));
            }
        }

        // If no downloads or error, return projects with 0 downloads
        return (data || []).map(project => ({
            ...project,
            total_downloads: 0
        }));
    },

    async getProjectStats() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        // Basic aggregates: counts, active/featured, downloads, revenue (sum of completed purchases)
        // Fetch ALL purchases first, then filter in JavaScript to ensure we don't miss any
        const [projectsRes, downloadsRes, purchasesRes] = await Promise.all([
            supabase.from('projects').select('id,is_active,is_featured', { count: 'exact' }),
            supabase.from('project_downloads').select('id', { count: 'exact' }),
            supabase.from('project_purchases').select('amount,payment_status', { count: 'exact' })
        ]);

        if (projectsRes.error) throw projectsRes.error;
        if (downloadsRes.error) throw downloadsRes.error;
        if (purchasesRes.error) {
            winston.error('Error fetching project purchases for stats:', purchasesRes.error);
            throw purchasesRes.error;
        }

        const projects = projectsRes.data || [];
        const totalProjects = projectsRes.count || 0;
        const activeProjects = projects.filter(p => p.is_active !== false).length;
        const featuredProjects = projects.filter(p => p.is_featured === true).length;
        const totalDownloads = downloadsRes.count || 0;

        // Calculate revenue from all purchases
        const purchases = purchasesRes.data || [];
        winston.info(`Total project purchases found: ${purchases.length}`);

        // Filter completed purchases and calculate revenue
        // If payment_status column exists, filter by it. Otherwise, include all purchases with amount > 0
        const completedPurchases = purchases.filter(p => {
            const amount = Number(p.amount || 0);

            // If payment_status exists, use it to filter
            if (p.payment_status !== undefined && p.payment_status !== null) {
                const status = String(p.payment_status).toLowerCase();
                return status === 'completed' || status === 'free' || status === 'paid';
            }

            // If payment_status doesn't exist or is null, include if amount > 0 (assume completed)
            // This handles legacy records or tables without payment_status column
            return amount > 0;
        });

        winston.info(`Completed project purchases: ${completedPurchases.length} out of ${purchases.length} total`);

        // Log all purchases for debugging
        purchases.forEach((p, idx) => {
            winston.debug(`Project Purchase ${idx + 1}: amount=₹${p.amount}, status=${p.payment_status || 'null/undefined'}`);
        });

        const revenue = completedPurchases.reduce((sum, p) => {
            // Ensure amount is a number and in rupees (not paise)
            const amount = Number(p.amount || 0);
            // If amount seems too large (likely in paise), divide by 100
            // But typically amounts should be in rupees already
            const amountInRupees = amount > 10000 ? amount / 100 : amount;
            return sum + amountInRupees;
        }, 0);

        winston.info(`Total project revenue calculated: ₹${revenue} from ${completedPurchases.length} completed purchases`);

        return { totalProjects, activeProjects, featuredProjects, totalDownloads, revenue };
    },

    async getProjectById(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async createProjectPurchase(purchaseData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('project_purchases')
            .insert([purchaseData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getProjectPurchase(userId, projectId) {
        if (!supabase) { return null; }
        try {
            // Get all purchases for this user and project, ordered by most recent
            const { data, error } = await supabase
                .from('project_purchases')
                .select('*')
                .eq('user_id', userId)
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            // Return the first (most recent) purchase, or null if none exist
            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            // Log the error but return null instead of throwing
            console.error('Error getting project purchase:', error);
            return null;
        }
    },

    async updateProjectPurchase(id, updateData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('project_purchases')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async trackProjectDownload(userId, projectId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { error } = await supabase
            .from('project_downloads')
            .insert([{ user_id: userId, project_id: projectId }]);
        if (error) throw error;
        return true;
    },

    async createProject(projectData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'description',
            'language',
            'category',
            'price',
            'original_price',
            'thumbnail_url',
            'download_url',
            'setup_pdf_url',
            'is_active',
            'is_featured'
        ];
        const clean = {};
        for (const key of allowed) {
            if (projectData[key] !== undefined) clean[key] = projectData[key];
        }
        const { data, error } = await supabase.from('projects').insert([clean]).select().single();
        if (error) throw error;
        return data;
    },

    async updateProject(id, projectData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'description',
            'language',
            'category',
            'price',
            'original_price',
            'thumbnail_url',
            'download_url',
            'setup_pdf_url',
            'is_active',
            'is_featured'
        ];
        const clean = {};
        for (const key of allowed) {
            if (projectData[key] !== undefined) clean[key] = projectData[key];
        }
        const { data, error } = await supabase.from('projects').update(clean).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    async deleteProject(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // Study materials
    async getStudyMaterials(includeInactive = false) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        let query = supabase
            .from('study_materials')
            .select('*');

        // If not including inactive, filter to only active materials
        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        // Get download counts for each material
        if (data && data.length > 0) {
            const materialIds = data.map(m => m.id);

            // Get download counts - database column is study_material_id (per schema)
            const { data: downloadsData, error: downloadsError } = await supabase
                .from('study_material_downloads')
                .select('study_material_id')
                .in('study_material_id', materialIds);

            if (!downloadsError && downloadsData) {
                // Count downloads per material
                const downloadCounts = downloadsData.reduce((acc, download) => {
                    if (download.study_material_id) {
                        acc[download.study_material_id] = (acc[download.study_material_id] || 0) + 1;
                    }
                    return acc;
                }, {});

                // Add download count to each material
                return data.map(material => ({
                    ...material,
                    total_downloads: downloadCounts[material.id] || 0
                }));
            }
        }

        // If no downloads or error, return materials with 0 downloads
        return (data || []).map(material => ({
            ...material,
            total_downloads: 0
        }));
    },

    async getStudyMaterialStats() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const [materialsRes, downloadsRes, purchasesRes] = await Promise.all([
            supabase.from('study_materials').select('id,is_active,is_featured', { count: 'exact' }),
            supabase.from('study_material_downloads').select('id', { count: 'exact' }),
            // Get ALL purchases first, then filter in JavaScript to ensure we don't miss any
            supabase.from('study_material_purchases')
                .select('amount,payment_status', { count: 'exact' })
        ]);

        if (materialsRes.error) throw materialsRes.error;
        if (downloadsRes.error) throw downloadsRes.error;
        if (purchasesRes.error) {
            winston.error('Error fetching study material purchases for stats:', purchasesRes.error);
            throw purchasesRes.error;
        }

        const materials = materialsRes.data || [];
        const totalMaterials = materialsRes.count || 0;
        const activeMaterials = materials.filter(m => m.is_active !== false).length;
        const featuredMaterials = materials.filter(m => m.is_featured === true).length;
        const totalDownloads = downloadsRes.count || 0;

        // Calculate revenue from all purchases
        const purchases = purchasesRes.data || [];
        winston.info(`Total purchases found: ${purchases.length}`);

        // Filter completed purchases and calculate revenue
        // If payment_status column exists, filter by it. Otherwise, include all purchases with amount > 0
        const completedPurchases = purchases.filter(p => {
            const amount = Number(p.amount || 0);

            // If payment_status exists, use it to filter
            if (p.payment_status !== undefined && p.payment_status !== null) {
                const status = String(p.payment_status).toLowerCase();
                return status === 'completed' || status === 'free' || status === 'paid';
            }

            // If payment_status doesn't exist or is null, include if amount > 0 (assume completed)
            // This handles legacy records or tables without payment_status column
            return amount > 0;
        });

        winston.info(`Completed purchases: ${completedPurchases.length} out of ${purchases.length} total`);

        // Log all purchases for debugging
        purchases.forEach((p, idx) => {
            winston.debug(`Purchase ${idx + 1}: amount=₹${p.amount}, status=${p.payment_status || 'null/undefined'}`);
        });

        const revenue = completedPurchases.reduce((sum, p) => {
            // Ensure amount is a number and in rupees (not paise)
            const amount = Number(p.amount || 0);
            // If amount seems too large (likely in paise), divide by 100
            // But typically amounts should be in rupees already
            const amountInRupees = amount > 10000 ? amount / 100 : amount;
            return sum + amountInRupees;
        }, 0);

        winston.info(`Total revenue calculated: ₹${revenue} from ${completedPurchases.length} completed purchases`);

        return { totalMaterials, activeMaterials, featuredMaterials, totalDownloads, revenue };
    },

    async getStudyMaterialById(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('study_materials')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async createStudyMaterialPurchase(purchaseData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        // Database uses material_id (not study_material_id) - confirmed by error messages
        // Support both material_id and study_material_id for compatibility
        const materialIdValue = purchaseData.material_id || purchaseData.study_material_id;

        winston.info('Creating study material purchase with data:', {
            user_id: purchaseData.user_id,
            material_id: materialIdValue,
            amount: purchaseData.amount,
            payment_status: purchaseData.payment_status,
            order_id: purchaseData.order_id
        });

        // Use material_id (actual database column name - confirmed by error messages)
        // order_id is required (NOT NULL constraint)
        const insertData = {
            user_id: purchaseData.user_id,
            material_id: materialIdValue,
            amount: purchaseData.amount,
            payment_status: purchaseData.payment_status,
            order_id: purchaseData.order_id || `order_${Date.now()}` // Required field
        };

        // Add payment_id if provided
        if (purchaseData.payment_id !== undefined) {
            insertData.payment_id = purchaseData.payment_id;
        }

        // Note: razorpay_order_id, razorpay_payment_id, razorpay_signature columns don't exist
        // The table only has order_id and payment_id columns

        let { data, error } = await supabase
            .from('study_material_purchases')
            .insert([insertData])
            .select()
            .single();

        // If error is due to missing columns, log it (shouldn't happen now since we only use order_id and payment_id)
        if (error && error.message && (
            error.message.includes('razorpay_order_id') ||
            error.message.includes('razorpay_payment_id') ||
            error.message.includes('razorpay_signature')
        )) {
            winston.warn('Razorpay columns not found, retrying without them:', error.message);
            const insertDataWithoutRazorpay = {
                user_id: purchaseData.user_id,
                material_id: materialIdValue,
                amount: purchaseData.amount,
                payment_status: purchaseData.payment_status,
                order_id: insertData.order_id || purchaseData.order_id || `order_${Date.now()}` // Required field
            };
            if (insertData.payment_id !== undefined) {
                insertDataWithoutRazorpay.payment_id = insertData.payment_id;
            } else if (purchaseData.payment_id !== undefined) {
                insertDataWithoutRazorpay.payment_id = purchaseData.payment_id;
            }
            const retryResult = await supabase
                .from('study_material_purchases')
                .insert([insertDataWithoutRazorpay])
                .select()
                .single();
            if (retryResult.error) {
                winston.error('Supabase createStudyMaterialPurchase error (retry):', {
                    error: retryResult.error.message,
                    code: retryResult.error.code,
                    details: retryResult.error.details,
                    hint: retryResult.error.hint
                });
                throw new Error(`Database error: ${retryResult.error.message}${retryResult.error.details ? ` - ${retryResult.error.details}` : ''}`);
            }
            data = retryResult.data;
            error = null;
        } else if (error) {
            winston.error('Supabase createStudyMaterialPurchase error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                purchaseData: purchaseData
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        winston.info('Study material purchase created successfully:', data.id);
        return data;
    },

    async getStudyMaterialPurchase(userId, materialId) {
        if (!supabase) { return null; }
        // Database column is material_id (not study_material_id) - confirmed by error messages
        const { data, error } = await supabase
            .from('study_material_purchases')
            .select('*')
            .eq('user_id', userId)
            .eq('material_id', materialId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async updateStudyMaterialPurchase(id, updateData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        winston.info(`Updating study material purchase ${id} with data:`, updateData);

        const { data, error } = await supabase
            .from('study_material_purchases')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            winston.error('Supabase updateStudyMaterialPurchase error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                purchaseId: id
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        if (!data) {
            winston.warn(`Study material purchase not found after update: ${id}`);
            throw new Error('Purchase record not found');
        }

        winston.info('Study material purchase updated successfully:', data.id);
        return data;
    },

    async trackStudyMaterialDownload(userId, materialId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        // Database column is study_material_id (per schema)
        const { error } = await supabase
            .from('study_material_downloads')
            .insert([{ user_id: userId, study_material_id: materialId }]);

        if (error) throw error;
        return true;
    },

    async createStudyMaterial(materialData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'description',
            'language',
            'category',
            'type',
            'price',
            'original_price',
            'file_url',
            'setup_pdf_url',
            'thumbnail_url',
            'is_active',
            'is_featured'
        ];
        const clean = {};
        for (const key of allowed) {
            if (materialData[key] !== undefined) {
                // Convert empty strings to null for optional text fields
                // Note: 'type' is now required, so don't convert it to null
                if ((key === 'description' || key === 'language' || key === 'category' ||
                    key === 'file_url' || key === 'setup_pdf_url' ||
                    key === 'thumbnail_url') && materialData[key] === '') {
                    clean[key] = null;
                } else {
                    clean[key] = materialData[key];
                }
            }
        }

        // Ensure title is not empty (required field)
        if (!clean.title || clean.title.trim() === '') {
            throw new Error('Title is required and cannot be empty');
        }

        // Ensure type is provided and not empty (required field)
        if (!clean.type || clean.type.trim() === '') {
            throw new Error('Type is required and cannot be empty. Must be one of: PDF, Notes, Ebook, Video, Document, Tutorial');
        }

        winston.info('Inserting study material with fields:', Object.keys(clean));

        const { data, error } = await supabase.from('study_materials').insert([clean]).select().single();

        if (error) {
            winston.error('Supabase createStudyMaterial error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                materialData: clean
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        winston.info('Study material created successfully:', data.id);
        return data;
    },

    async updateStudyMaterial(id, materialData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'description',
            'language',
            'category',
            'type',
            'price',
            'original_price',
            'file_url',
            'setup_pdf_url',
            'thumbnail_url',
            'is_active',
            'is_featured'
        ];
        const clean = {};
        for (const key of allowed) {
            if (materialData[key] !== undefined) {
                // Convert empty strings to null for optional text fields
                // Note: 'type' is now required, so don't convert it to null
                if ((key === 'description' || key === 'language' || key === 'category' ||
                    key === 'file_url' || key === 'setup_pdf_url' ||
                    key === 'thumbnail_url') && materialData[key] === '') {
                    clean[key] = null;
                } else {
                    clean[key] = materialData[key];
                }
            }
        }

        // Ensure title is not empty if it's being updated (required field)
        if (clean.title !== undefined) {
            if (typeof clean.title === 'string') {
                clean.title = clean.title.trim();
                if (clean.title === '') {
                    throw new Error('Title is required and cannot be empty');
                }
            } else if (!clean.title) {
                throw new Error('Title is required and cannot be empty');
            }
        }

        // Ensure type is not empty if it's being updated (required field)
        if (clean.type !== undefined) {
            if (typeof clean.type === 'string') {
                clean.type = clean.type.trim();
                if (clean.type === '') {
                    throw new Error('Type is required and cannot be empty. Must be one of: PDF, Notes, Ebook, Video, Document, Tutorial');
                }
            } else if (!clean.type) {
                throw new Error('Type is required and cannot be empty. Must be one of: PDF, Notes, Ebook, Video, Document, Tutorial');
            }
        }

        // Don't update if no fields to update
        if (Object.keys(clean).length === 0) {
            winston.warn('No fields to update for study material:', id);
            // Still return the existing material
            const { data: existing, error: existingError } = await supabase.from('study_materials').select('*').eq('id', id).single();
            if (existingError) throw existingError;
            return existing;
        }

        winston.info('Updating study material:', id, 'with fields:', Object.keys(clean));

        const { data, error } = await supabase
            .from('study_materials')
            .update(clean)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            winston.error('Supabase updateStudyMaterial error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                materialId: id,
                cleanData: clean
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        if (!data) {
            winston.error('Study material not found after update:', id);
            throw new Error('Study material not found');
        }

        winston.info('Study material updated successfully:', data.id);
        return data;
    },

    async deleteStudyMaterial(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { error } = await supabase.from('study_materials').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    // Course Categories and Languages
    async getCourseCategories() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('course_categories')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async createCourseCategory(name) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const { data, error } = await supabase
            .from('course_categories')
            .insert([{ name, slug }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Category already exists');
            }
            throw error;
        }
        return data;
    },

    async getCourseLanguages() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('course_languages')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async createCourseLanguage(name) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const { data, error } = await supabase
            .from('course_languages')
            .insert([{ name, slug }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Language already exists');
            }
            throw error;
        }
        return data;
    },

    // Analytics
    async saveAnalyticsEvent(eventData) {
        const { data, error } = await supabase
            .from('analytics_events')
            .insert([eventData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserAnalytics(userId, startDate, endDate) {
        const { data, error } = await supabase
            .from('analytics_events')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Jobs operations
    async getJobs(includeInactive = false) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        let query = supabase
            .from('jobs')
            .select('*')
            .order('posted_date', { ascending: false });

        if (!includeInactive) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Transform data to match frontend interface
        return (data || []).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            salary: {
                min: job.salary_min || 0,
                max: job.salary_max || 0,
                currency: job.salary_currency || 'INR'
            },
            experience: job.experience || 'entry',
            skills: job.skills || [],
            description: job.description || '',
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            category: job.category || 'General',
            isRemote: job.is_remote || false,
            isFeatured: job.is_featured || false,
            // preserve active status for admin views and filtering
            is_active: job.is_active,
            contact: {
                email: job.contact_email,
                phone: job.contact_phone || null,
                website: job.contact_website || null
            },
            companyPdfUrl: job.company_pdf_url || null,
            postedDate: job.posted_date ? new Date(job.posted_date) : new Date(),
            applications: job.applications_count || 0,
        }));
    },

    async getJobById(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return {
            id: data.id,
            title: data.title,
            company: data.company,
            location: data.location,
            type: data.type,
            salary: {
                min: data.salary_min || 0,
                max: data.salary_max || 0,
                currency: data.salary_currency || 'INR'
            },
            experience: data.experience || 'entry',
            skills: data.skills || [],
            description: data.description || '',
            requirements: data.requirements || [],
            benefits: data.benefits || [],
            category: data.category || 'General',
            isRemote: data.is_remote || false,
            isFeatured: data.is_featured || false,
            is_active: data.is_active,
            contact: {
                email: data.contact_email,
                phone: data.contact_phone || null,
                website: data.contact_website || null
            },
            companyPdfUrl: data.company_pdf_url || null,
            postedDate: data.posted_date ? new Date(data.posted_date) : new Date(),
            applications: data.applications_count || 0,
        };
    },

    // Resume operations
    async createUserResume({ userId, resumeUrl, rawText, preferredDomains }) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        // Simple keyword-based skill extraction from rawText
        const text = (rawText || '').toLowerCase();
        const knownSkills = [
            'python', 'java', 'javascript', 'typescript', 'react', 'node', 'spring', 'django',
            'c++', 'c#', 'go', 'rust', 'kotlin', 'swift', 'php', 'ruby', 'sql', 'mongodb', 'postgres',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'marketing', 'seo', 'sem',
            'data science', 'machine learning', 'deep learning', 'nlp'
        ];

        const extracted_skills = Array.from(new Set(
            knownSkills.filter(skill => text.includes(skill))
        ));

        const insertData = {
            user_id: userId,
            resume_url: resumeUrl,
            raw_text: rawText || null,
            extracted_skills: extracted_skills.length ? extracted_skills : null,
            preferred_domains: Array.isArray(preferredDomains) && preferredDomains.length ? preferredDomains : null,
        };

        const { data, error } = await supabase
            .from('user_resumes')
            .insert([insertData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserResumes(userId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('user_resumes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getAllResumes() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('user_resumes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getJobRecommendationsForUser(userId) {
        // Get latest resume for user
        const resumes = await this.getUserResumes(userId);
        if (!resumes.length) {
            return [];
        }
        const latest = resumes[0];
        const skills = latest.extracted_skills || [];
        const domains = latest.preferred_domains || [];

        // Load active jobs
        const jobs = await this.getJobs(false);

        if ((!skills || skills.length === 0) && (!domains || domains.length === 0)) {
            return jobs.slice(0, 10);
        }

        const skillSet = new Set((skills || []).map(s => String(s).toLowerCase()));
        const domainSet = new Set((domains || []).map(d => String(d).toLowerCase()));

        const scored = jobs.map(job => {
            const jobSkills = (job.skills || []).map(s => String(s).toLowerCase());
            const jobCategory = (job.category || '').toLowerCase();

            let score = 0;
            for (const s of jobSkills) {
                if (skillSet.has(s)) score += 2;
            }
            if (jobCategory && domainSet.has(jobCategory)) {
                score += 3;
            }
            return { job, score };
        });

        return scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.job)
            .slice(0, 20);
    },

    async getJobStats() {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const [jobsRes, applicationsRes] = await Promise.all([
            supabase.from('jobs').select('id,is_active,is_featured', { count: 'exact' }),
            supabase.from('job_applications').select('id', { count: 'exact' })
        ]);

        if (jobsRes.error) throw jobsRes.error;
        if (applicationsRes.error) throw applicationsRes.error;

        const jobs = jobsRes.data || [];
        const totalJobs = jobsRes.count || 0;
        const activeJobs = jobs.filter(j => j.is_active !== false).length;
        const featuredJobs = jobs.filter(j => j.is_featured === true).length;
        const totalApplications = applicationsRes.count || 0;

        return { totalJobs, activeJobs, featuredJobs, totalApplications };
    },

    async createJob(jobData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'company',
            'location',
            'type',
            'salary_min',
            'salary_max',
            'salary_currency',
            'experience',
            'skills',
            'description',
            'requirements',
            'benefits',
            'category',
            'is_remote',
            'is_featured',
            'is_active',
            'contact_email',
            'contact_phone',
            'contact_website',
            'company_pdf_url'
        ];

        const clean = {};
        for (const key of allowed) {
            if (jobData[key] !== undefined) {
                // Convert empty strings to null for optional fields
                if ((key === 'description' || key === 'contact_phone' || key === 'contact_website' ||
                    key === 'experience' || key === 'category' || key === 'company_pdf_url') && jobData[key] === '') {
                    clean[key] = null;
                } else {
                    clean[key] = jobData[key];
                }
            }
        }

        // Ensure required fields
        if (!clean.title || clean.title.trim() === '') {
            throw new Error('Title is required and cannot be empty');
        }
        if (!clean.company || clean.company.trim() === '') {
            throw new Error('Company is required and cannot be empty');
        }
        if (!clean.location || clean.location.trim() === '') {
            throw new Error('Location is required and cannot be empty');
        }
        if (!clean.type || clean.type.trim() === '') {
            throw new Error('Type is required and cannot be empty');
        }
        if (!clean.contact_email || clean.contact_email.trim() === '') {
            throw new Error('Contact email is required and cannot be empty');
        }

        winston.info('Inserting job with fields:', Object.keys(clean));

        const { data, error } = await supabase.from('jobs').insert([clean]).select().single();

        if (error) {
            winston.error('Supabase createJob error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                jobData: clean
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        winston.info('Job created successfully:', data.id);
        return data;
    },

    async updateJob(id, jobData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const allowed = [
            'title',
            'company',
            'location',
            'type',
            'salary_min',
            'salary_max',
            'salary_currency',
            'experience',
            'skills',
            'description',
            'requirements',
            'benefits',
            'category',
            'is_remote',
            'is_featured',
            'is_active',
            'contact_email',
            'contact_phone',
            'contact_website',
            'company_pdf_url'
        ];

        const clean = {};
        for (const key of allowed) {
            if (jobData[key] !== undefined) {
                // Convert empty strings to null for optional fields
                if ((key === 'description' || key === 'contact_phone' || key === 'contact_website' ||
                    key === 'experience' || key === 'category' || key === 'company_pdf_url') && jobData[key] === '') {
                    clean[key] = null;
                } else {
                    clean[key] = jobData[key];
                }
            }
        }

        // Ensure required fields if being updated
        if (clean.title !== undefined && (!clean.title || clean.title.trim() === '')) {
            throw new Error('Title is required and cannot be empty');
        }
        if (clean.company !== undefined && (!clean.company || clean.company.trim() === '')) {
            throw new Error('Company is required and cannot be empty');
        }
        if (clean.location !== undefined && (!clean.location || clean.location.trim() === '')) {
            throw new Error('Location is required and cannot be empty');
        }
        if (clean.type !== undefined && (!clean.type || clean.type.trim() === '')) {
            throw new Error('Type is required and cannot be empty');
        }
        if (clean.contact_email !== undefined && (!clean.contact_email || clean.contact_email.trim() === '')) {
            throw new Error('Contact email is required and cannot be empty');
        }

        clean.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('jobs')
            .update(clean)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            winston.error('Supabase updateJob error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                jobId: id,
                jobData: clean
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        if (!data) {
            throw new Error('Job not found');
        }

        winston.info('Job updated successfully:', data.id);
        return data;
    },

    async deleteJob(id) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    async createJobApplication(applicationData) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }

        const insertData = {
            user_id: applicationData.user_id,
            job_id: applicationData.job_id,
            cover_letter: applicationData.cover_letter || null,
            resume_url: applicationData.resume_url || null,
        };

        const { data, error } = await supabase
            .from('job_applications')
            .insert([insertData])
            .select()
            .single();

        if (error) {
            winston.error('Supabase createJobApplication error:', {
                error: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw new Error(`Database error: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        }

        return data;
    },

    async getJobApplication(userId, jobId) {
        if (!supabase) {
            return null;
        }
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('user_id', userId)
            .eq('job_id', jobId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getUserJobApplications(userId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('job_applications')
            .select('*, jobs(*)')
            .eq('user_id', userId)
            .order('applied_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async incrementJobApplicationsCount(jobId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        // Get current count
        const { data: job } = await supabase
            .from('jobs')
            .select('applications_count')
            .eq('id', jobId)
            .single();

        if (job) {
            const newCount = (job.applications_count || 0) + 1;
            await supabase
                .from('jobs')
                .update({ applications_count: newCount })
                .eq('id', jobId);
        }
    },

    async saveJob(userId, jobId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('saved_jobs')
            .insert([{ user_id: userId, job_id: jobId }])
            .select()
            .single();

        if (error) {
            // If already saved, return existing
            if (error.code === '23505') { // Unique violation
                return true;
            }
            throw error;
        }
        return !!data;
    },

    async unsaveJob(userId, jobId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { error } = await supabase
            .from('saved_jobs')
            .delete()
            .eq('user_id', userId)
            .eq('job_id', jobId);

        if (error) throw error;
        return true;
    },

    async getSavedJobs(userId) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase
            .from('saved_jobs')
            .select('*, jobs(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Challenge operations
    async getChallenges(filters = {}) {
        if (!supabase) throw new Error('Supabase not configured.');
        let query = supabase.from('challenges').select('*');

        if (filters.category) query = query.eq('category', filters.category);
        if (filters.language) query = query.eq('language', filters.language);
        if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);

        const { data, error } = await query.order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getChallengeById(id) {
        if (!supabase) throw new Error('Supabase not configured.');
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getUserChallengeProgress(userId, challengeId) {
        if (!supabase) throw new Error('Supabase not configured.');
        const { data, error } = await supabase
            .from('user_challenge_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('challenge_id', challengeId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async getUserChallengesProgress(userId) {
        if (!supabase) throw new Error('Supabase not configured.');
        const { data, error } = await supabase
            .from('user_challenge_progress')
            .select('*')
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    },

    async updateUserChallengeProgress(progressData) {
        if (!supabase) throw new Error('Supabase not configured.');

        // 1. Check if already completed to avoid double points
        const { data: existing } = await supabase
            .from('user_challenge_progress')
            .select('status')
            .eq('user_id', progressData.user_id)
            .eq('challenge_id', progressData.challenge_id)
            .single();

        const { data, error } = await supabase
            .from('user_challenge_progress')
            .upsert([progressData], { onConflict: 'user_id, challenge_id' })
            .select()
            .single();

        if (error) throw error;

        // 2. If newly completed, increment user total points
        if (progressData.status === 'completed' && (!existing || existing.status !== 'completed')) {
            try {
                // Fetch current progress (or create if doesn't exist)
                let { data: progress, error: progressError } = await supabase
                    .from('user_progress')
                    .select('total_points, challenges_completed')
                    .eq('user_id', progressData.user_id)
                    .single();

                // If user_progress doesn't exist, initialize it
                if (progressError && progressError.code === 'PGRST116') {
                    const { data: newProgress } = await supabase
                        .from('user_progress')
                        .insert({
                            user_id: progressData.user_id,
                            total_points: 0,
                            challenges_completed: 0,
                            last_activity: new Date().toISOString()
                        })
                        .select()
                        .single();
                    progress = newProgress;
                }

                const currentPoints = progress?.total_points || 0;
                const currentCompleted = progress?.challenges_completed || 0;

                // Fetch challenge points (default to 50 if not found)
                const { data: challenge } = await supabase
                    .from('challenges')
                    .select('points')
                    .eq('id', progressData.challenge_id)
                    .single();

                const pointsToAdd = challenge?.points || 50;

                await supabase
                    .from('user_progress')
                    .upsert({
                        user_id: progressData.user_id,
                        total_points: currentPoints + pointsToAdd,
                        challenges_completed: currentCompleted + 1,
                        last_activity: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                winston.info(`Points updated for user ${progressData.user_id}: +${pointsToAdd} (Total: ${currentPoints + pointsToAdd}, Completed: ${currentCompleted + 1})`);
            } catch (err) {
                winston.error('Failed to update user points:', err);
            }
        }

        return data;
    },

    async getLeaderboard(limit = 10) {
        if (!supabase) throw new Error('Supabase not configured.');

        // Join user_progress with users to get names/avatars
        const { data, error } = await supabase
            .from('user_progress')
            .select(`
                total_points,
                user_id,
                users (
                    name,
                    avatar
                )
            `)
            .order('total_points', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async getDistinctLanguages() {
        if (!supabase) throw new Error('Supabase not configured.');

        const { data, error } = await supabase
            .from('challenges')
            .select('language');

        if (error) throw error;

        // Filter unique languages in JS to avoid complex distinct query in Supabase simple select
        const languages = [...new Set(data.map(item => item.language))];
        return languages;
    },

    // Tutorial operations
    async getTutorials() {
        if (!supabase) throw new Error('Supabase not configured.');
        const { data, error } = await supabase
            .from('tutorials')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getTutorialById(id) {
        if (!supabase) throw new Error('Supabase not configured.');
        const { data, error } = await supabase
            .from('tutorials')
            .select('*, tutorial_steps(*)')
            .eq('id', id)
            .single();
        if (error) throw error;

        if (data && data.tutorial_steps) {
            data.tutorial_steps.sort((a, b) => a.order_index - b.order_index);
        }
        return data;
    },

    // Storage operations
    async uploadFile(bucket, path, fileBuffer, contentType) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, fileBuffer, {
                contentType,
                upsert: true
            });

        if (error) throw error;
        return data;
    },

    async getPublicUrl(bucket, path) {
        if (!supabase) {
            throw new Error('Supabase not configured.');
        }
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    },
};

module.exports = { supabase, db, testConnection };