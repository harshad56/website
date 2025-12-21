const express = require('express');
const { db } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get community posts
// @access  Public
router.get('/posts', async(req, res) => {
    try {
        const { category, page = 1 } = req.query;
        const posts = await db.getPosts(category, parseInt(page), 10);
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        winston.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get posts'
        });
    }
});

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authenticateToken, async(req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        const postData = {
            author_id: req.user.id,
            title,
            content,
            category,
            tags: tags || []
        };

        const post = await db.createPost(postData);
        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        winston.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create post'
        });
    }
});

module.exports = router;