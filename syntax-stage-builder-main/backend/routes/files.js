const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 100 * 1024 * 1024, // 100MB
        fieldSize: 10 * 1024 * 1024, // 10MB for other fields
        files: 1 // Only one file at a time
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
router.post('/upload', authenticateToken, upload.single('file'), handleMulterError, async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const relativePath = `/uploads/documents/${req.file.filename}`;

        const fileUrl = `${baseUrl}${relativePath}`;

        winston.info(`File uploaded successfully: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileId: req.file.filename,
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
router.get('/:id', authenticateToken, async(req, res) => {
    try {
        // For now, just echo back a constructed URL based on file ID
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const relativePath = `/uploads/documents/${req.params.id}`;

        res.json({
            success: true,
            message: 'File retrieval endpoint',
            data: {
                fileId: req.params.id,
                url: `${baseUrl}${relativePath}`
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