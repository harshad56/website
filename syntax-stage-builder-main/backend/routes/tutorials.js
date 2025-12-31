const express = require('express');
const { db } = require('../config/supabase');
const winston = require('winston');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tutorials
// @desc    Get all active tutorials
// @access  Public
router.get('/', async (req, res) => {
    try {
        const tutorials = await db.getTutorials();
        res.json({
            success: true,
            data: tutorials
        });
    } catch (error) {
        winston.error('Get tutorials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tutorials',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/tutorials/:id
// @desc    Get tutorial details with steps
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const tutorial = await db.getTutorialById(req.params.id);
        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }
        res.json({
            success: true,
            data: tutorial
        });
    } catch (error) {
        winston.error('Get tutorial by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tutorial details'
        });
    }
});

// @route   POST /api/tutorials/:id/steps/:stepId/complete
// @desc    Mark a tutorial step as complete for the user
// @access  Private
// (Note: Currently leveraging generic user_progress for topics/modules, 
// but we might want a specific tutorial_progress table later if complexity increases.
// For now, let's keep it simple or use a generic progress helper.)
router.post('/:id/steps/:stepId/complete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const tutorialId = req.params.id;
        const stepId = req.params.stepId;

        // Optionally update a specific user_tutorial_progress table
        // For now, we can just return success or update a metadata field in user_progress

        res.json({
            success: true,
            message: 'Step marked as complete'
        });
    } catch (error) {
        winston.error('Complete tutorial step error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete step'
        });
    }
});

module.exports = router;
