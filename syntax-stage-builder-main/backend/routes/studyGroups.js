const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Admin email configuration
const ADMIN_EMAILS = ["harshadbagal77@gmail.com"];

const isAdmin = (email) => {
    return email && ADMIN_EMAILS.includes(email.toLowerCase());
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user || !isAdmin(req.user.email)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// GET /api/study-groups - Get all active study groups (public)
router.get('/', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching study groups:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch study groups' });
    }
});

// GET /api/study-groups/admin/all - Get ALL groups (admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching all study groups:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch study groups' });
    }
});

// POST /api/study-groups - Create a new study group (Admin Only for now, though typically users might too)
// User requested: "page asl admin add data required also remember only harshadbagal77@gmail.com can acess admin page"
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const {
            name,
            topic,
            level,
            description,
            max_members = 10,
            is_private = false,
            meeting_frequency = 'Weekly',
            avatar,
            tags = [],
            gradient
        } = req.body;

        if (!name || !topic || !description) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('study_groups')
            .insert([{
                name,
                topic,
                level,
                description,
                max_members,
                members: 1, // Start with 1 member (or 0 if pure admin create)
                is_private,
                is_active: true,
                created_by: req.user.email,
                meeting_frequency,
                avatar,
                tags,
                gradient,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({ success: true, data });
    } catch (error) {
        winston.error('Error creating study group:', error);
        return res.status(500).json({ success: false, message: 'Failed to create study group', error: error.message });
    }
});

// PUT /api/study-groups/:id - Update study group (Admin Only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        // Prevent updating protected fields if necessary, usually we trust admin
        delete updates.id;
        delete updates.created_at;

        const { data, error } = await supabase
            .from('study_groups')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error updating study group:', error);
        return res.status(500).json({ success: false, message: 'Failed to update study group' });
    }
});

// DELETE /api/study-groups/:id - Delete study group (Admin Only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { error } = await supabase
            .from('study_groups')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return res.json({ success: true, message: 'Study group deleted successfully' });
    } catch (error) {
        winston.error('Error deleting study group:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete study group' });
    }
});

module.exports = router;
