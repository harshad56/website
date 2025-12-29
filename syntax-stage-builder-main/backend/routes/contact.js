const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const { sendEmail } = require('../services/emailService');

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submissions
 * @access  Public
 */
router.post('/', [
    // Validation middleware
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('department').optional().trim()
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
            message: 'Please provide valid information'
        });
    }

    const { name, email, subject, message, department } = req.body;
    const supportEmail = process.env.EMAIL_SUPPORT_ADDRESS || 'codeacademypro7@gmail.com'; // Fallback or env var

    try {
        // 1. Send email to support team
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                <p><strong>Department:</strong> ${department || 'General Inquiry'}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This email was sent from the CodeAcademy Pro Contact Form.
                </p>
            </div>
        `;

        await sendEmail({
            to: supportEmail,
            subject: `[Contact Form] ${subject}`,
            html: emailContent,
            text: `Name: ${name}\nEmail: ${email}\nDepartment: ${department}\nSubject: ${subject}\n\nMessage:\n${message}`
        });

        // 2. (Optional) Send acknowledgement to user
        // We can implement this later if needed, for now just notify support.

        winston.info(`Contact form submission processed from ${email}`);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        winston.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message.',
            debug_error: error.message // Exposed for debugging
        });
    }
});

module.exports = router;
