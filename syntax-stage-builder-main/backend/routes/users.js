const express = require('express');
const { db } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive information
        const { password, email_verification_token, password_reset_token, ...userProfile } = user;

        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        winston.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, bio, location, website, avatar } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (website !== undefined) updates.website = website;
        if (avatar !== undefined) updates.avatar = avatar;

        const updatedUser = await db.updateUser(req.user.id, updates);

        // Remove sensitive information
        const { password, email_verification_token, password_reset_token, ...userProfile } = updatedUser;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userProfile
        });
    } catch (error) {
        winston.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});


// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, async (req, res) => {
    try {
        const { preferredLanguage, difficulty, notifications } = req.body;

        // Construct preferences object
        // Note: This replaces the entire preferences object. 
        // If partial updates are needed, we'd need to fetch -> merge -> update.
        // For now, assuming the frontend sends the full preferences object as per Settings.tsx logic.
        const preferences = {
            preferredLanguage,
            difficulty,
            notifications
        };

        const updatedUser = await db.updateUser(req.user.id, { preferences });

        // Remove sensitive information
        const { password, email_verification_token, password_reset_token, ...userProfile } = updatedUser;

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: userProfile
        });
    } catch (error) {
        winston.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences'
        });
    }
});

module.exports = router;