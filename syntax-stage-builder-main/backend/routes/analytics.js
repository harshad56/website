const express = require('express');
const { db } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// @route   GET /api/analytics/user
// @desc    Get user analytics
// @access  Private
router.get('/user', authenticateToken, async(req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const analytics = await db.getUserAnalytics(req.user.id, startDate, endDate);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        winston.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics'
        });
    }
});

// @route   POST /api/analytics/event
// @desc    Track analytics event
// @access  Private
router.post('/event', authenticateToken, async(req, res) => {
    try {
        const { eventType, eventData, sessionId } = req.body;

        const eventDataToSave = {
            user_id: req.user.id,
            event_type: eventType,
            event_data: eventData || {},
            session_id: sessionId,
            user_agent: req.get('User-Agent'),
            ip_address: req.ip
        };

        await db.saveAnalyticsEvent(eventDataToSave);

        res.json({
            success: true,
            message: 'Event tracked successfully'
        });
    } catch (error) {
        winston.error('Track event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track event'
        });
    }
});

module.exports = router;