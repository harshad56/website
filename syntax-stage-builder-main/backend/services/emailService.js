const { Resend } = require('resend');
const winston = require('winston');

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates (same as before, adapted if needed)
const emailTemplates = {
    emailVerification: (data) => ({
        subject: 'Verify your email address',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CodeAcademy Pro!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p>${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The CodeAcademy Pro Team</p>
      </div>
    `
    }),

    passwordReset: (data) => ({
        subject: 'Reset your password',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p>${data.resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>The CodeAcademy Pro Team</p>
      </div>
    `
    }),

    welcomeEmail: (data) => ({
        subject: 'Welcome to CodeAcademy Pro!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CodeAcademy Pro!</h2>
        <p>Hi ${data.name},</p>
        <p>Welcome to CodeAcademy Pro! We're excited to have you on board.</p>
        <p>Here's what you can do to get started:</p>
        <ul>
          <li>Explore our course catalog</li>
          <li>Try the interactive code editor</li>
          <li>Join our community forums</li>
          <li>Connect with other learners</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy coding!<br>The CodeAcademy Pro Team</p>
      </div>
    `
    })
};

// Send email function using Resend
const sendEmail = async ({ to, subject, template, data, html, text }) => {
    try {
        let emailContent = {};

        if (template && emailTemplates[template]) {
            emailContent = emailTemplates[template](data);
        } else {
            emailContent = {
                subject: subject || 'CodeAcademy Pro Notification',
                html: html || text || 'No content provided'
            };
        }

        const from = process.env.EMAIL_FROM_NAME
            ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev'}>`
            : 'CodeAcademy Pro <onboarding@resend.dev>';

        winston.info(`Sending email via Resend to: ${to}`);

        const { data: responseData, error } = await resend.emails.send({
            from: from,
            to: [to],
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text // Resend can handle plain text too
        });

        if (error) {
            winston.error('Resend API Error:', error);
            throw new Error(`Resend failed: ${error.message}`);
        }

        winston.info('Email sent successfully via Resend:', {
            id: responseData.id,
            to
        });

        return {
            success: true,
            messageId: responseData.id
        };
    } catch (error) {
        winston.error('Email sending failed:', error);
    } catch (error) {
        winston.error('Email sending failed:', error);
        throw new Error(error.message);
    }
};

// Send verification email
const sendVerificationEmail = async (user, verificationUrl) => {
    return sendEmail({
        to: user.email,
        template: 'emailVerification',
        data: {
            name: user.name,
            verificationUrl
        }
    });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetUrl) => {
    return sendEmail({
        to: user.email,
        template: 'passwordReset',
        data: {
            name: user.name,
            resetUrl
        }
    });
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
    return sendEmail({
        to: user.email,
        template: 'welcomeEmail',
        data: {
            name: user.name
        }
    });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
};