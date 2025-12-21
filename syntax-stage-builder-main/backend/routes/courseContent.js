const express = require('express');
const { db } = require('../config/supabase');
const winston = require('winston');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin access in production
const requireAuth = async(req, res, next) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment && !req.headers['authorization']) {
        req.user = {
            id: 'dev-user-id',
            email: 'dev@example.com',
            name: 'Dev User',
            role: 'admin',
            is_active: true
        };
        return next();
    }
    
    return authenticateToken(req, res, next);
};

const requireAdmin = (req, res, next) => {
    const isAdmin = req.user?.role === 'admin' || req.user?.role === 'Admin';
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (!isAdmin && !isDevelopment) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

// @route   POST /api/courses/:courseId/modules
// @desc    Create a module for a course
// @access  Private/Admin
router.post('/courses/:courseId/modules', requireAuth, requireAdmin, async(req, res) => {
    try {
        const { title, description, order_index } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Module title is required'
            });
        }

        const module = await db.createModule({
            course_id: req.params.courseId,
            title,
            description: description || '',
            order_index: order_index || 0,
            is_published: true
        });

        res.status(201).json({
            success: true,
            data: module
        });
    } catch (error) {
        winston.error('Create module error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create module',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/modules/:moduleId/lessons
// @desc    Create a lesson for a module
// @access  Private/Admin
router.post('/modules/:moduleId/lessons', requireAuth, requireAdmin, async(req, res) => {
    try {
        const { title, description, lesson_type, order_index, duration_minutes, is_preview } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Lesson title is required'
            });
        }

        const lesson = await db.createLesson({
            module_id: req.params.moduleId,
            title,
            description: description || '',
            lesson_type: lesson_type || 'video',
            order_index: order_index || 0,
            duration_minutes: duration_minutes || 0,
            is_preview: is_preview || false,
            is_published: true
        });

        res.status(201).json({
            success: true,
            data: lesson
        });
    } catch (error) {
        winston.error('Create lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create lesson',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/lessons/:lessonId/videos
// @desc    Add a video to a lesson
// @access  Private/Admin
router.post('/lessons/:lessonId/videos', requireAuth, requireAdmin, async(req, res) => {
    try {
        const { video_url, video_provider, video_id, thumbnail_url, transcript } = req.body;

        if (!video_url && !video_id) {
            return res.status(400).json({
                success: false,
                message: 'Video URL or Video ID is required'
            });
        }

        const video = await db.createVideo({
            lesson_id: req.params.lessonId,
            video_url: video_url || null,
            video_provider: video_provider || 'youtube',
            video_id: video_id || null,
            thumbnail_url: thumbnail_url || null,
            transcript: transcript || null,
            is_published: true
        });

        res.status(201).json({
            success: true,
            data: video
        });
    } catch (error) {
        winston.error('Create video error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add video',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/lessons/:lessonId/documents
// @desc    Add a document to a lesson
// @access  Private/Admin
router.post('/lessons/:lessonId/documents', requireAuth, requireAdmin, async(req, res) => {
    try {
        const { title, document_url, document_type, download_allowed } = req.body;

        if (!title || !document_url) {
            return res.status(400).json({
                success: false,
                message: 'Document title and URL are required'
            });
        }

        const document = await db.createDocument({
            lesson_id: req.params.lessonId,
            title,
            document_url,
            document_type: document_type || 'pdf',
            download_allowed: download_allowed !== false,
            is_published: true
        });

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (error) {
        winston.error('Create document error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add document',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/lessons/:lessonId/complete
// @desc    Mark a lesson as complete
// @access  Private
router.post('/lessons/:lessonId/complete', requireAuth, async(req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user.id;

        // Get enrollment for this lesson's course
        const lesson = await db.getLessonById(lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        const module = await db.getModuleById(lesson.module_id);
        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const enrollment = await db.getEnrollment(userId, module.course_id);
        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this course'
            });
        }

        // Mark lesson as complete
        await db.completeLesson({
            user_id: userId,
            lesson_id: lessonId,
            enrollment_id: enrollment.id,
            is_completed: true
        });

        res.json({
            success: true,
            message: 'Lesson marked as complete'
        });
    } catch (error) {
        winston.error('Complete lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark lesson as complete',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// --- Module management (Admin) ---

// Update module
router.put('/modules/:id', requireAuth, requireAdmin, async(req, res) => {
    try {
        const moduleId = req.params.id;
        const { title, description, order_index } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Module title is required'
            });
        }

        const updated = await db.updateModule(moduleId, {
            title,
            description: description || '',
            order_index: typeof order_index === 'number' ? order_index : undefined
        });

        res.json({
            success: true,
            data: updated,
            message: 'Module updated successfully'
        });
    } catch (error) {
        winston.error('Update module error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update module',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete module (cascades to lessons/content via FKs)
router.delete('/modules/:id', requireAuth, requireAdmin, async(req, res) => {
    try {
        const moduleId = req.params.id;
        await db.deleteModule(moduleId);

        res.json({
            success: true,
            message: 'Module deleted successfully'
        });
    } catch (error) {
        winston.error('Delete module error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete module',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;


