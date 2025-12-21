const nodemailer = require('nodemailer');
const winston = require('winston');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Email templates
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

// Send email function
const sendEmail = async({ to, subject, template, data, html, text }) => {
    try {
        const transporter = createTransporter();

        let emailContent = {};

        if (template && emailTemplates[template]) {
            emailContent = emailTemplates[template](data);
        } else {
            emailContent = {
                subject: subject || 'CodeAcademy Pro Notification',
                html: html || text || 'No content provided'
            };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@codeacademy-pro.com',
            to,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text || emailContent.html.replace(/<[^>]*>/g, '')
        };

        const info = await transporter.sendMail(mailOptions);

        winston.info('Email sent successfully:', {
            messageId: info.messageId,
            to,
            subject: emailContent.subject
        });

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        winston.error('Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};

// Send verification email
const sendVerificationEmail = async(user, verificationUrl) => {
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
const sendPasswordResetEmail = async(user, resetUrl) => {
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
const sendWelcomeEmail = async(user) => {
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