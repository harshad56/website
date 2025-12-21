const express = require('express');
const { db } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// @route   POST /api/code-execution/execute
// @desc    Execute code
// @access  Private
router.post('/execute', authenticateToken, async(req, res) => {
    try {
        const { language, code, testCases } = req.body;

        // For now, we'll return a mock response
        // In a real implementation, this would use the code execution engine
        const result = {
            output: 'Code executed successfully!',
            executionTime: Math.random() * 1000 + 100,
            memoryUsage: Math.random() * 50 + 10,
            language,
            version: '1.0.0'
        };

        // Save execution to database
        await db.saveCodeExecution({
            user_id: req.user.id,
            language,
            code,
            output: result.output,
            execution_time: result.executionTime,
            memory_usage: result.memoryUsage,
            test_results: testCases || []
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        winston.error('Code execution error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to execute code'
        });
    }
});

// @route   GET /api/code-execution/history
// @desc    Get user's code execution history
// @access  Private
router.get('/history', authenticateToken, async(req, res) => {
    try {
        const history = await db.getUserCodeHistory(req.user.id, 50);
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        winston.error('Get code history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get code history'
        });
    }
});

module.exports = router;