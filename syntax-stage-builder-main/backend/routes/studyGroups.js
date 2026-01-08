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

// GET /api/study-groups/my-groups - Get groups joined by current user
router.get('/my-groups', authenticateToken, async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { data, error } = await supabase
            .from('study_group_members')
            .select('group_id')
            .eq('user_email', req.user.email);

        if (error) throw error;

        // Extract group IDs
        const groupIds = data.map(m => m.group_id);

        // Fetch actual group details
        if (groupIds.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const { data: groups, error: groupsError } = await supabase
            .from('study_groups')
            .select('*')
            .in('id', groupIds)
            .eq('is_active', true);

        if (groupsError) throw groupsError;

        return res.json({ success: true, data: groups });
    } catch (error) {
        winston.error('Error fetching my study groups:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch my study groups' });
    }
});

// GET /api/study-groups/:id - Get Single Group Details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching study group:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch study group' });
    }
});


// POST /api/study-groups/:id/join - Join a group
router.post('/:id/join', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userEmail = req.user.email;

        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        // Check if already member
        const { data: existing, error: checkError } = await supabase
            .from('study_group_members')
            .select('*')
            .eq('group_id', id)
            .eq('user_email', userEmail)
            .single();

        // If error is "PGRST116" it means not found (good), otherwise real error
        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existing) {
            return res.status(400).json({ success: false, message: 'Already a member' });
        }

        // Insert member
        const { error } = await supabase
            .from('study_group_members')
            .insert([{
                group_id: id,
                user_email: userEmail
            }]);

        if (error) throw error;

        return res.json({ success: true, message: 'Joined successfully' });
    } catch (error) {
        winston.error('Error joining study group:', error);
        return res.status(500).json({ success: false, message: 'Failed to join group' });
    }
});

// POST /api/study-groups/:id/leave - Leave a group
router.post('/:id/leave', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userEmail = req.user.email;

        if (!supabase) {
            return res.status(503).json({ success: false, message: 'Database service unavailable' });
        }

        const { error } = await supabase
            .from('study_group_members')
            .delete()
            .eq('group_id', id)
            .eq('user_email', userEmail);

        if (error) throw error;

        return res.json({ success: true, message: 'Left successfully' });
        return res.status(500).json({ success: false, message: 'Failed to leave group' });
    }
});

// GET /api/study-groups/:id/members - Get members of a group
router.get('/:id/members', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!supabase) return res.status(503).json({ success: false, message: 'Database service unavailable' });

        // Simple fetch for now. In a real app we'd join with a 'users' table or fetch profiles from Auth
        // For now we just return the member records which contain user_email
        const { data, error } = await supabase
            .from('study_group_members')
            .select('*')
            .eq('group_id', id);

        if (error) throw error;
        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching members:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch members' });
    }
});

// GET /api/study-groups/:id/messages - Get discussion messages
router.get('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!supabase) return res.status(503).json({ success: false, message: 'Database service unavailable' });

        const { data, error } = await supabase
            .from('group_messages')
            .select('*')
            .eq('group_id', id)
            .order('created_at', { ascending: true });

        // If table doesn't exist yet, it will throw. We should ideally handle that visually in frontend or here.
        if (error) throw error;
        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching messages:', error);
        // Return empty array on error (e.g. table missing) to prevent UI crash
        return res.json({ success: true, data: [] });
    }
});

// POST /api/study-groups/:id/messages - Send a message
router.post('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, userName, userAvatar } = req.body;

        if (!content) return res.status(400).json({ success: false, message: 'Content required' });
        if (!supabase) return res.status(503).json({ success: false, message: 'Database service unavailable' });

        const { data, error } = await supabase
            .from('group_messages')
            .insert([{
                group_id: id,
                user_email: req.user.email,
                user_name: userName || req.user.email.split('@')[0],
                user_avatar: userAvatar,
                content
            }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    } catch (error) {
        winston.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// GET /api/study-groups/:id/resources - Get resources
router.get('/:id/resources', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!supabase) return res.status(503).json({ success: false, message: 'Database service unavailable' });

        const { data, error } = await supabase
            .from('group_resources')
            .select('*')
            .eq('group_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, data });
    } catch (error) {
        winston.error('Error fetching resources:', error);
        return res.json({ success: true, data: [] });
    }
});

// POST /api/study-groups/:id/resources - Add a resource
router.post('/:id/resources', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, type, userName } = req.body;

        if (!title || !url) return res.status(400).json({ success: false, message: 'Title and URL required' });
        if (!supabase) return res.status(503).json({ success: false, message: 'Database service unavailable' });

        const { data, error } = await supabase
            .from('group_resources')
            .insert([{
                group_id: id,
                title,
                url,
                type: type || 'link',
                added_by: req.user.email,
                added_by_name: userName || req.user.email.split('@')[0]
            }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    } catch (error) {
        winston.error('Error adding resource:', error);
        return res.status(500).json({ success: false, message: 'Failed to add resource' });
    }
});

module.exports = router;
