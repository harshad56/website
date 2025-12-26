const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { db } = require('../config/supabase');

const router = express.Router();

// Use memory storage for buffer-based uploads to Supabase
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Reduced to 10MB for memory efficiency
        fieldSize: 2 * 1024 * 1024,
        files: 1
    }
});

// Error handler for multer file size errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File too large. Maximum file size is 100MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Only one file allowed at a time.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    if (err) {
        winston.error('File upload error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to upload file'
        });
    }
    next();
};

// @route   POST /api/files/upload
// @desc    Upload a file (PDF, DOCX, etc.) and return a URL
// @access  Private
router.post('/upload', authenticateToken, upload.single('file'), handleMulterError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(req.file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        const bucket = 'uploads';
        const filePath = `documents/${filename}`;

        // Upload to Supabase Storage
        await db.uploadFile(bucket, filePath, req.file.buffer, req.file.mimetype);

        // Get permanent public URL
        const fileUrl = await db.getPublicUrl(bucket, filePath);

        winston.info(`File uploaded to Supabase successfully: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileId: filename,
                url: fileUrl,
                originalName: req.file.originalname,
                size: req.file.size,
                mimeType: req.file.mimetype
            }
        });
    } catch (error) {
        winston.error('File upload error:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload file',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/files/:id
// @desc    Get file by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const bucket = 'uploads';
        const filePath = `documents/${req.params.id}`;

        // Get permanent public URL
        const fileUrl = await db.getPublicUrl(bucket, filePath);

        res.json({
            success: true,
            message: 'File retrieval endpoint',
            data: {
                fileId: req.params.id,
                url: fileUrl
            }
        });
    } catch (error) {
        winston.error('Get file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get file'
        });
    }
});

module.exports = router;