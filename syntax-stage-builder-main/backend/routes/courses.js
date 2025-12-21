const express = require('express');
const crypto = require('crypto');
const { db } = require('../config/supabase');
const winston = require('winston');
const { authenticateToken, authorize } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// Stripe setup (optional – legacy / global payments)
let stripe = null;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (stripeSecretKey) {
    try {
        stripe = require('stripe')(stripeSecretKey);
        winston.info('Stripe initialized successfully');
    } catch (err) {
        winston.error('Failed to initialize Stripe SDK:', err);
        stripe = null;
    }
} else {
    winston.warn('STRIPE_SECRET_KEY not set. Stripe payments are disabled; using Razorpay or mock checkout.');
}

// Razorpay setup (preferred for India: UPI, cards, netbanking, wallets)
let razorpay = null;
const Razorpay = (() => {
    try {
        return require('razorpay');
    } catch (err) {
        winston.error('Failed to load Razorpay SDK:', err);
        return null;
    }
})();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (Razorpay && razorpayKeyId && razorpayKeySecret) {
    try {
        razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });
        winston.info('Razorpay initialized successfully');
    } catch (err) {
        winston.error('Failed to initialize Razorpay client:', err);
        razorpay = null;
    }
} else {
    winston.warn('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set. Razorpay payments are disabled.');
}

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async(req, res) => {
    try {
        const courses = await db.getCourses();
        res.json({
            success: true,
            data: courses
        });
    } catch (error) {
        winston.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get courses'
        });
    }
});

// @route   GET /api/courses/stats/summary
// @desc    Get course stats for admin dashboard
// @access  Private/Admin
router.get('/stats/summary', authenticateToken, authorize('admin'), async(req, res) => {
    try {
        const stats = await db.getCourseStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        winston.error('Get course stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch course stats' });
    }
});

// @route   GET /api/courses/categories
// @desc    Get all course categories
// @access  Public
router.get('/categories', async(req, res) => {
    try {
        const categories = await db.getCourseCategories();
        res.json({ success: true, data: categories });
    } catch (error) {
        winston.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
});

// @route   POST /api/courses/categories
// @desc    Create a new category
// @access  Private/Admin
router.post('/categories', authenticateToken, authorize('admin'), async(req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const category = await db.createCourseCategory(name.trim());
        res.json({ success: true, data: category });
    } catch (error) {
        winston.error('Create category error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create category' });
    }
});

// @route   GET /api/courses/languages
// @desc    Get all course languages
// @access  Public
router.get('/languages', async(req, res) => {
    try {
        const languages = await db.getCourseLanguages();
        res.json({ success: true, data: languages });
    } catch (error) {
        winston.error('Get languages error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch languages' });
    }
});

// @route   POST /api/courses/languages
// @desc    Create a new language
// @access  Private/Admin
router.post('/languages', authenticateToken, authorize('admin'), async(req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Language name is required' });
        }
        const language = await db.createCourseLanguage(name.trim());
        res.json({ success: true, data: language });
    } catch (error) {
        winston.error('Create language error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create language' });
    }
});

// @route   POST /api/courses
// @desc    Create a new course (admin only)
// @access  Private/Admin
router.post('/', async(req, res, next) => {
    // In development, allow without auth for testing
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment && !req.headers['authorization']) {
        // Create a mock user for development
        req.user = {
            id: 'dev-user-id',
            email: 'dev@example.com',
            name: 'Dev User',
            role: 'admin',
            is_active: true
        };
        return next();
    }
    
    // Otherwise, require authentication
    return authenticateToken(req, res, next);
}, async(req, res) => {
    try {
        // Check if user is admin or allow in development
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'Admin';
        const isDevelopment = process.env.NODE_ENV !== 'production';
        
        if (!isAdmin && !isDevelopment) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions. Admin access required.'
            });
        }

        const { title, description, language, difficulty, estimatedDuration, totalLessons, price, imageUrl, tags, isPublished, category } = req.body;

        if (!title || !language) {
            return res.status(400).json({
                success: false,
                message: 'Title and language are required'
            });
        }

        // Prepare course data matching Supabase schema
        const courseData = {
            title,
            description: description || '',
            language,
            difficulty: difficulty || 'beginner',
            estimated_duration: estimatedDuration || null,
            total_lessons: totalLessons ? parseInt(totalLessons, 10) : 0,
            is_published: typeof isPublished === 'boolean' ? isPublished : true,
            created_by: req.user?.id || null, // Allow null in development
            category: category || null
        };

        // Add optional fields if provided (will be filtered if columns don't exist)
        if (imageUrl && imageUrl.trim()) {
            // Reject base64 data URLs - they're too long for VARCHAR(500)
            // Only accept regular HTTP/HTTPS URLs
            const trimmedUrl = imageUrl.trim();
            if (trimmedUrl.startsWith('data:')) {
                winston.warn('Base64 image URLs are not supported. Please use a regular image URL (http:// or https://)');
                // Don't include base64 URLs - they exceed the 500 character limit
            } else if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
                // Validate URL length
                if (trimmedUrl.length > 500) {
                    winston.warn('Image URL is too long (max 500 characters). Truncating or skipping.');
                } else {
                    courseData.image_url = trimmedUrl;
                }
            } else {
                winston.warn('Invalid image URL format. Must start with http:// or https://');
            }
        }
        
        if (price !== undefined && price !== null && price !== '') {
            const priceValue = parseFloat(price);
            if (!isNaN(priceValue) && priceValue >= 0) {
                courseData.price = priceValue;
            }
        }
        
        if (tags) {
            if (Array.isArray(tags) && tags.length > 0) {
                courseData.tags = tags;
            } else if (typeof tags === 'string' && tags.trim()) {
                // Handle comma-separated tags
                const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
                if (tagArray.length > 0) {
                    courseData.tags = tagArray;
                }
            }
        }

        winston.info('Creating course with data:', courseData);
        const course = await db.createCourse(courseData);

        res.status(201).json({
            success: true,
            data: course,
            message: 'Course created successfully'
        });
    } catch (error) {
        winston.error('Create course error:', {
            message: error.message,
            stack: error.stack,
            user: req.user?.id
        });
        
        const errorMessage = error.message || 'Failed to create course';
        const statusCode = error.message?.includes('permission') || error.message?.includes('permission') ? 403 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                details: error.details || error.hint
            } : undefined
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const course = await db.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        winston.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get course'
        });
    }
});

// @route   GET /api/courses/:id/certificate
// @desc    Generate a simple course completion certificate PDF
// @access  Private (requires auth)
router.get('/:id/certificate', authenticateToken, async(req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user?.id || 'user';
        const course = await db.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Require enrollment
        const enrollment = await db.getEnrollment(userId, courseId);
        if (!enrollment) {
            return res.status(403).json({ success: false, message: 'Enroll in this course to access the certificate.' });
        }

        // Require 100% completion if there are lessons
        const completion = await db.getCourseCompletion(userId, courseId);
        if (completion.totalLessons > 0 && completion.completedLessons < completion.totalLessons) {
            return res.status(403).json({
                success: false,
                message: 'Complete all lessons to unlock your certificate.'
            });
        }

        const certificateId = `CERT-${courseId.slice(0, 6)}-${userId.slice(0, 6)}-${Date.now().toString().slice(-4)}`;
        const verifyUrl = `https://codeacademy.example/verify/${certificateId}`;
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 220 });
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            const base64 = pdfBuffer.toString('base64');
            const blobUrl = `data:application/pdf;base64,${base64}`;
            res.json({
                success: true,
                data: {
                    certificateId,
                    url: blobUrl,
                    blobUrl
                }
            });
        });

        // Background and branding
        const gradient = doc.linearGradient(0, 0, 600, 0);
        gradient.stop(0, '#0f172a').stop(1, '#1e293b');
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(gradient);

        // Header bar with logo
        doc.save();
        doc.rect(0, 0, doc.page.width, 120).fill('#1d4ed8');
        // Logo block (text-based to avoid external asset dependency)
        const logoWidth = 150;
        const logoHeight = 60;
        const logoX = doc.page.width - logoWidth - 40;
        const logoY = 30;
        doc.roundedRect(logoX, logoY, logoWidth, logoHeight, 12).fill('#0ea5e9');
        doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(18).text('CodeAcademy', logoX, logoY + 14, { width: logoWidth, align: 'center' });
        doc.fillColor('#0f172a').font('Helvetica').fontSize(10).text('PRO', logoX, logoY + 34, { width: logoWidth, align: 'center' });
        // Title
        doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('Certificate of Completion', 50, 42, { align: 'left' });
        doc.restore();

        // Absolute layout to keep single page
        const bodyTop = 170;
        doc.fillColor('#e2e8f0').fontSize(14).text('This is to certify that', 50, bodyTop, { align: 'center', width: doc.page.width - 100 });
        doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text(req.user?.name || 'Student', 50, bodyTop + 22, { align: 'center', width: doc.page.width - 100 });
        doc.fillColor('#cbd5e1').fontSize(14).font('Helvetica').text('has successfully completed the course', 50, bodyTop + 52, { align: 'center', width: doc.page.width - 100 });
        doc.fillColor('#38bdf8').fontSize(22).font('Helvetica-Bold').text(course.title || 'Course', 50, bodyTop + 80, { align: 'center', width: doc.page.width - 100 });

        // Divider
        const dividerY = bodyTop + 125;
        doc.strokeColor('#334155').lineWidth(1.2).moveTo(80, dividerY).lineTo(doc.page.width - 80, dividerY).stroke();
        doc.fillColor('#8ba3c7').fontSize(11).text('Keep building. Keep shipping. Your next milestone starts here.', 50, dividerY + 8, { align: 'center', width: doc.page.width - 100 });

        // Details column (left) - moved down more
        const detailY = dividerY + 50;
        doc.fontSize(12).fillColor('#cbd5e1');
        doc.text(`Issued to: ${req.user?.email || 'student'}`, 80, detailY);
        doc.text(`Completion: ${completion.totalLessons === 0 ? 'N/A' : '100% of lessons'}`, 80, detailY + 18);
        doc.text(`Certificate ID: ${certificateId}`, 80, detailY + 36);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 80, detailY + 54);
        doc.text(`Course: ${course.title || courseId}`, 80, detailY + 72);

        // QR code (right side, positioned below details section) - moved down more
        const qrSize = 110;
        const qrBoxPad = 12;
        const qrX = doc.page.width - qrSize - qrBoxPad - 80;
        const qrY = detailY + 100; // Positioned further below the details section
        doc.roundedRect(qrX - qrBoxPad, qrY - qrBoxPad, qrSize + qrBoxPad * 2, qrSize + qrBoxPad * 2, 10).fill('#0b1224');
        doc.image(qrDataUrl, qrX, qrY, { width: qrSize, height: qrSize });
        doc.fillColor('#94a3b8').fontSize(10).text('Scan to verify', qrX - qrBoxPad, qrY + qrSize + qrBoxPad - 2, { width: qrSize + qrBoxPad * 2, align: 'center' });

        // Signature block (lower left, moved down more below details)
        const sigX = 80;
        const sigY = detailY + 140; // Moved down further below details section
        doc.strokeColor('#38bdf8').lineWidth(1).moveTo(sigX, sigY + 40).lineTo(sigX + 140, sigY + 40).stroke();
        doc.fillColor('#e2e8f0').fontSize(12).text('Course Director', sigX, sigY + 50, { width: 140, align: 'center' });
        doc.fillColor('#94a3b8').fontSize(10).text('CodeAcademy Pro', sigX, sigY + 64, { width: 140, align: 'center' });

        // Website content section (moved to lower side, below signature and QR code)
        const websiteContentY = sigY + 130; // Positioned further down below signature block
        doc.fillColor('#8ba3b8').fontSize(10).text('Visit us at www.codeacademypro.com', 50, websiteContentY, { align: 'center', width: doc.page.width - 100 });
        doc.fillColor('#64748b').fontSize(9).text('Explore more courses, projects, and study materials to continue your learning journey', 50, websiteContentY + 14, { align: 'center', width: doc.page.width - 100 });

        // Footer (centered, single line)
        const footerY = doc.page.height - 80;
        doc.fillColor('#64748b').fontSize(9).text(`Verify at: ${verifyUrl}    |    Course ID: ${courseId}    |    User ID: ${userId}`, 50, footerY, { align: 'center', width: doc.page.width - 100 });

        doc.end();
    } catch (error) {
        winston.error('Certificate generation error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate certificate' });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/:id', async(req, res, next) => {
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
}, async(req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'Admin';
        const isDevelopment = process.env.NODE_ENV !== 'production';
        
        if (!isAdmin && !isDevelopment) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions. Admin access required.'
            });
        }

        const { title, description, language, difficulty, estimatedDuration, totalLessons, price, imageUrl, tags, isPublished, category } = req.body;

        if (!title || !language) {
            return res.status(400).json({
                success: false,
                message: 'Title and language are required'
            });
        }

        const courseData = {
            title,
            description: description || '',
            language,
            difficulty: difficulty || 'beginner',
            estimated_duration: estimatedDuration || null,
            total_lessons: totalLessons ? parseInt(totalLessons, 10) : 0,
            is_published: typeof isPublished === 'boolean' ? isPublished : true,
            category: category || null
        };

        if (imageUrl && imageUrl.trim()) {
            // Reject base64 data URLs - they're too long for VARCHAR(500)
            const trimmedUrl = imageUrl.trim();
            if (trimmedUrl.startsWith('data:')) {
                winston.warn('Base64 image URLs are not supported. Please use a regular image URL.');
            } else if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
                if (trimmedUrl.length > 500) {
                    winston.warn('Image URL is too long (max 500 characters).');
                } else {
                    courseData.image_url = trimmedUrl;
                }
            }
        }
        
        if (price !== undefined && price !== null && price !== '') {
            const priceValue = parseFloat(price);
            if (!isNaN(priceValue) && priceValue >= 0) {
                courseData.price = priceValue;
            }
        }
        
        if (tags) {
            if (Array.isArray(tags) && tags.length > 0) {
                courseData.tags = tags;
            } else if (typeof tags === 'string' && tags.trim()) {
                const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
                if (tagArray.length > 0) {
                    courseData.tags = tagArray;
                }
            }
        }

        const course = await db.updateCourse(req.params.id, courseData);

        res.json({
            success: true,
            data: course,
            message: 'Course updated successfully'
        });
    } catch (error) {
        winston.error('Update course error:', {
            message: error.message,
            stack: error.stack,
            courseId: req.params.id
        });
        
        const errorMessage = error.message || 'Failed to update course';
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                details: error.details || error.hint
            } : undefined
        });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/:id', async(req, res, next) => {
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
}, async(req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'Admin';
        const isDevelopment = process.env.NODE_ENV !== 'production';
        
        if (!isAdmin && !isDevelopment) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions. Admin access required.'
            });
        }

        await db.deleteCourse(req.params.id);

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        winston.error('Delete course error:', {
            message: error.message,
            stack: error.stack,
            courseId: req.params.id
        });
        
        const errorMessage = error.message || 'Failed to delete course';
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll user in a course
// @access  Private (must be logged in)
router.post('/:id/enroll', authenticateToken, async(req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        // Check if already enrolled
        const existingEnrollment = await db.getEnrollment(userId, courseId);
        if (existingEnrollment) {
            return res.json({
                success: true,
                data: existingEnrollment,
                message: 'Already enrolled in this course'
            });
        }

        // Get course to check price
        const course = await db.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const isPaidCourse = !!course.price && Number(course.price) > 0;
        if (isPaidCourse) {
            // Do NOT enroll paid courses here – require payment first
            return res.status(402).json({
                success: false,
                requiresPayment: true,
                message: 'This is a paid course. Please complete payment before enrolling.'
            });
        }

        // Create enrollment for free course
        const enrollment = await db.createEnrollment({
            user_id: userId,
            course_id: courseId,
            payment_status: 'free',
            progress_percentage: 0
        });

        res.status(201).json({
            success: true,
            data: enrollment,
            message: 'Successfully enrolled in course'
        });
    } catch (error) {
        winston.error('Enroll course error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to enroll in course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/courses/:id/enrollment
// @desc    Check if user is enrolled in course
// @access  Private (must be logged in)
router.get('/:id/enrollment', authenticateToken, async(req, res) => {
    try {
        const enrollment = await db.getEnrollment(req.user.id, req.params.id);
        if (enrollment) {
            res.json({
                success: true,
                data: enrollment
            });
        } else {
            res.json({
                success: false,
                data: null
            });
        }
    } catch (error) {
        winston.error('Check enrollment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check enrollment'
        });
    }
});

// @route   GET /api/courses/:id/content
// @desc    Get course content (modules, lessons, videos, documents)
// @access  Private (enrolled users only, or admin)
router.get('/:id/content', authenticateToken, async(req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        // Check enrollment (or allow admin)
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'Admin';
        
        if (!isAdmin) {
            const enrollment = await db.getEnrollment(userId, courseId);
            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: 'You must enroll in this course first'
                });
            }
        }

        // Get course with full content
        const courseContent = await db.getCourseContent(courseId, userId);

        res.json({
            success: true,
            data: courseContent
        });
    } catch (error) {
        winston.error('Get course content error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get course content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/courses/:id/checkout
// @desc    Create Stripe Checkout session for a paid course
// @access  Private (must be logged in)
router.post('/:id/checkout', authenticateToken, async(req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        const course = await db.getCourseById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const price = Number(course.price) || 0;
        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'This course is free and does not require payment'
            });
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Prefer Razorpay for India-compatible payments
        if (razorpay) {
            const amountPaise = Math.round(price * 100); // ₹ to paise

            // Razorpay requires receipt length <= 40 characters
            const shortCourseId = String(courseId).slice(0, 8);
            const receipt = `course_${shortCourseId}_${Date.now()}`; // well under 40 chars

            const order = await razorpay.orders.create({
                amount: amountPaise,
                currency: 'INR',
                receipt,
                notes: {
                    course_id: courseId,
                    user_id: userId,
                    type: 'course_purchase',
                },
            });

            return res.json({
                success: true,
                data: {
                    razorpayOrderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    keyId: razorpayKeyId,
                    course: {
                        id: courseId,
                        title: course.title,
                        description: course.description,
                    },
                },
            });
        }

        // Fallback: Stripe (if configured)
        if (stripe) {
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.title,
                            description: course.description || undefined,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                }],
                metadata: {
                    course_id: courseId,
                    user_id: userId,
                },
                success_url: `${frontendUrl}/course/${courseId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/course/${courseId}?payment=cancelled`,
            });

            return res.json({
                success: true,
                data: { url: session.url },
            });
        }

        // Last resort: payment gateway not configured
        winston.error('No payment gateway (Razorpay or Stripe) is configured on the server');
        return res.status(500).json({
            success: false,
            message: 'Payment gateway is not configured. Please contact support.',
        });
    } catch (error) {
        winston.error('Create course checkout session error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create checkout session',
        });
    }
});

// @route   POST /api/courses/:id/payment/verify
// @desc    Verify Razorpay payment signature and enroll user in course
// @access  Private (must be logged in)
router.post('/:id/payment/verify', authenticateToken, async(req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing Razorpay payment details',
            });
        }

        if (!razorpayKeySecret) {
            winston.error('RAZORPAY_KEY_SECRET not configured – cannot verify payment');
            return res.status(500).json({
                success: false,
                message: 'Payment verification is not configured on the server',
            });
        }

        // Verify signature
        const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', razorpayKeySecret)
            .update(payload)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            winston.error('Invalid Razorpay signature', {
                razorpay_order_id,
                razorpay_payment_id,
            });
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Signature valid: enroll user if not already enrolled
        const existingEnrollment = await db.getEnrollment(userId, courseId);
        if (existingEnrollment) {
            return res.json({
                success: true,
                data: existingEnrollment,
                message: 'Already enrolled in this course',
            });
        }

        const enrollment = await db.createEnrollment({
            user_id: userId,
            course_id: courseId,
            payment_status: 'paid',
            payment_id: razorpay_payment_id, // Store Razorpay payment ID (string)
            progress_percentage: 0,
        });

        return res.status(201).json({
            success: true,
            data: enrollment,
            message: 'Payment verified and enrollment created successfully',
        });
    } catch (error) {
        winston.error('Verify Razorpay payment error:', {
            message: error.message,
            stack: error.stack,
            courseId: req.params.id,
            userId: req.user?.id,
            errorDetails: error
        });
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment and enroll in course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

module.exports = router;