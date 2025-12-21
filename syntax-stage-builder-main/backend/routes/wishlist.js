const express = require('express');
const { supabase } = require('../config/supabase');
const winston = require('winston');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!supabase) {
            return res.status(500).json({ success: false, message: 'Database not configured' });
        }

        const { data, error } = await supabase
            .from('course_wishlists')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data || []
        });
    } catch (error) {
        winston.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get wishlist'
        });
    }
});

// @route   POST /api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: 'course_id is required'
            });
        }

        if (!supabase) {
            return res.status(500).json({ success: false, message: 'Database not configured' });
        }

        // Check if already in wishlist
        const existing = await supabase
            .from('course_wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', course_id)
            .single();

        if (existing.data) {
            return res.json({
                success: true,
                data: existing.data,
                message: 'Already in wishlist'
            });
        }

        // Add to wishlist
        const { data, error } = await supabase
            .from('course_wishlists')
            .insert([{
                user_id: userId,
                course_id
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data
        });
    } catch (error) {
        winston.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add to wishlist'
        });
    }
});

// @route   DELETE /api/wishlist/:itemId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/:itemId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { itemId } = req.params;

        if (!supabase) {
            return res.status(500).json({ success: false, message: 'Database not configured' });
        }

        const { error } = await supabase
            .from('course_wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('course_id', itemId);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Removed from wishlist'
        });
    } catch (error) {
        winston.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from wishlist'
        });
    }
});

// @route   GET /api/wishlist/check/:itemId
// @desc    Check if item is in wishlist
// @access  Private
router.get('/check/:itemId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { itemId } = req.params;

        if (!supabase) {
            return res.status(500).json({ success: false, message: 'Database not configured' });
        }

        const { data, error } = await supabase
            .from('course_wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', itemId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({
            success: true,
            inWishlist: !!data
        });
    } catch (error) {
        winston.error('Check wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check wishlist'
        });
    }
});

module.exports = router;

