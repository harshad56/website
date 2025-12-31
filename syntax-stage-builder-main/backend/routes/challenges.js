const express = require('express');
const { db } = require('../config/supabase');
const winston = require('winston');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper for development mode
const getUserId = (req) => {
    return req.user?.id || 'dev-user-id';
};

// @route   GET /api/challenges
// @desc    Get all challenges with optional filters
// @access  Public (or Private if preferred)
router.get('/', async (req, res) => {
    try {
        const { category, language, difficulty } = req.query;
        const challenges = await db.getChallenges({ category, language, difficulty });

        res.json({
            success: true,
            data: challenges
        });
    } catch (error) {
        winston.error('Get challenges error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenges',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/challenges/:id
// @desc    Get challenge details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const challenge = await db.getChallengeById(req.params.id);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }
        res.json({
            success: true,
            data: challenge
        });
    } catch (error) {
        winston.error('Get challenge by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch challenge details'
        });
    }
});

// @route   POST /api/challenges/:id/progress
// @desc    Update user progress for a challenge
// @access  Private
router.post('/:id/progress', authenticateToken, async (req, res) => {
    try {
        const { status, submitted_code, attempts_count, completion_time_ms } = req.body;
        const userId = req.user.id;
        const challengeId = req.params.id;

        const progress = await db.updateUserChallengeProgress({
            user_id: userId,
            challenge_id: challengeId,
            status,
            submitted_code,
            attempts_count,
            completion_time_ms,
            last_attempt_at: new Date().toISOString()
        });

        res.json({
            success: true,
            data: progress,
            message: 'Progress updated successfully'
        });
    } catch (error) {
        winston.error('Update challenge progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress'
        });
    }
});

// @route   GET /api/challenges/user/progress
// @desc    Get user's progress for all challenges
// @access  Private
router.get('/user/progress', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await db.supabase
            .from('user_challenge_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        winston.error('Get user challenge progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user progress'
        });
    }
});

module.exports = router;
