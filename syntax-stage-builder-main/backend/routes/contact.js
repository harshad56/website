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
// Multer setup for file uploads (max 5MB)
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submissions with optional attachment
 * @access  Public
 */
router.post('/', upload.single('attachment'), [
    // Validation is tricky with multer + express-validator because body is parsed differently.
    // We will validate manually or rely on express-validator running AFTER multer.
    // Express-validator needs to run on req.body which is populated by multer.
    body('name').trim().notEmpty().withMessage('Name is required'),
], async (req, res) => {
    // Manually run validations since middleware order matters
    await body('name').trim().notEmpty().withMessage('Name is required').run(req);
    await body('email').isEmail().withMessage('Invalid email address').run(req);
    await body('subject').trim().notEmpty().withMessage('Subject is required').run(req);
    await body('message').trim().notEmpty().withMessage('Message is required').run(req);

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
    const supportEmail = process.env.EMAIL_SUPPORT_ADDRESS || 'harshadbagal145@gmail.com'; // Testing mode requires registered email

    try {
        // Prepare attachments if present
        let attachments = [];
        if (req.file) {
            attachments.push({
                filename: req.file.originalname,
                content: req.file.buffer
            });
        }

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
                ${req.file ? `<p><strong>Attachment:</strong> ${req.file.originalname}</p>` : ''}
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This email was sent from the CodeAcademy Pro Contact Form.
                </p>
            </div>
        `;

        await sendEmail({
            to: supportEmail,
            subject: `[Contact Form] ${subject}`,
            html: emailContent,
            text: `Name: ${name}\nEmail: ${email}\nDepartment: ${department}\nSubject: ${subject}\n\nMessage:\n${message}`,
            replyTo: email, // Allow replying directly to the user
            attachments: attachments
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
