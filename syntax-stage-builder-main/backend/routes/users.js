const express = require('express');
const { db } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async(req, res) => {
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
router.put('/profile', authenticateToken, async(req, res) => {
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

module.exports = router;