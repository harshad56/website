const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticateToken, authorize } = require('../middleware/auth');
const requireAdmin = authorize('admin');

// Get all languages (public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('programming_languages')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;

        res.json({
            success: true,
            languages: data || []
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch languages',
            error: error.message
        });
    }
});

// Get single language by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from('programming_languages')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            language: data
        });
    } catch (error) {
        console.error('Error fetching language:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch language',
            error: error.message
        });
    }
});

// Get questions for a language (public)
router.get('/:languageId/questions', async (req, res) => {
    try {
        const { languageId } = req.params;
        const { difficulty, category, limit = 50 } = req.query;

        let query = supabase
            .from('language_interview_questions')
            .select('*')
            .eq('language_id', languageId)
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .limit(parseInt(limit));

        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({
            success: true,
            questions: data || []
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions',
            error: error.message
        });
    }
});

// Admin: Create new language
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            icon_emoji,
            color_from,
            color_to,
            display_order
        } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Name and slug are required'
            });
        }

        const { data, error } = await supabase
            .from('programming_languages')
            .insert([{
                name,
                slug,
                description,
                icon_emoji,
                color_from,
                color_to,
                display_order: display_order || 0
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Language created successfully',
            language: data
        });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create language',
            error: error.message
        });
    }
});

// Admin: Update language
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            slug,
            description,
            icon_emoji,
            color_from,
            color_to,
            display_order,
            is_active
        } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (icon_emoji !== undefined) updateData.icon_emoji = icon_emoji;
        if (color_from !== undefined) updateData.color_from = color_from;
        if (color_to !== undefined) updateData.color_to = color_to;
        if (display_order !== undefined) updateData.display_order = display_order;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabase
            .from('programming_languages')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Language updated successfully',
            language: data
        });
    } catch (error) {
        console.error('Error updating language:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update language',
            error: error.message
        });
    }
});

// Admin: Delete language
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('programming_languages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Language deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete language',
            error: error.message
        });
    }
});

// Admin: Create question for a language
router.post('/:languageId/questions', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { languageId } = req.params;
        const {
            question,
            answer,
            code_example,
            difficulty,
            category,
            tags,
            display_order
        } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Question and answer are required'
            });
        }

        const { data, error } = await supabase
            .from('language_interview_questions')
            .insert([{
                language_id: languageId,
                question,
                answer,
                code_example,
                difficulty: difficulty || 'medium',
                category,
                tags,
                display_order: display_order || 0
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Question created successfully',
            question: data
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create question',
            error: error.message
        });
    }
});

// Admin: Update question
router.put('/:languageId/questions/:questionId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { questionId } = req.params;
        const {
            question,
            answer,
            code_example,
            difficulty,
            category,
            tags,
            display_order,
            is_active
        } = req.body;

        const updateData = {};
        if (question !== undefined) updateData.question = question;
        if (answer !== undefined) updateData.answer = answer;
        if (code_example !== undefined) updateData.code_example = code_example;
        if (difficulty !== undefined) updateData.difficulty = difficulty;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (display_order !== undefined) updateData.display_order = display_order;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabase
            .from('language_interview_questions')
            .update(updateData)
            .eq('id', questionId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Question updated successfully',
            question: data
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update question',
            error: error.message
        });
    }
});

// Admin: Delete question
router.delete('/:languageId/questions/:questionId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { questionId } = req.params;

        const { error } = await supabase
            .from('language_interview_questions')
            .delete()
            .eq('id', questionId);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question',
            error: error.message
        });
    }
});

module.exports = router;
