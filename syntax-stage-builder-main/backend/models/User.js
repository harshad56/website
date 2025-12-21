const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Added missing import

const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    avatar: {
        type: String,
        default: null
    },

    // Authentication & Verification
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,

    // OAuth Integration
    oauthProvider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'github'],
        default: 'local'
    },
    oauthId: String,

    // Profile Information
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    location: String,
    website: String,
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String
    },

    // Learning Progress
    progress: {
        completedModules: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        }],
        completedTopics: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic'
        }],
        totalPoints: {
            type: Number,
            default: 0
        },
        currentStreak: {
            type: Number,
            default: 0
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        achievements: [{
            type: String,
            enum: [
                'first_completion',
                'week_streak',
                'month_streak',
                'perfect_score',
                'helpful_member',
                'course_complete',
                'certification_earned',
                'mentor_help',
                'community_leader'
            ]
        }],
        lastActivity: {
            type: Date,
            default: Date.now
        }
    },

    // Learning Preferences
    preferences: {
        preferredLanguage: {
            type: String,
            enum: ['python', 'javascript', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'typescript', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'dart', 'elixir'],
            default: 'python'
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            achievements: {
                type: Boolean,
                default: true
            },
            courseUpdates: {
                type: Boolean,
                default: true
            },
            community: {
                type: Boolean,
                default: true
            }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'auto'
        },
        language: {
            type: String,
            default: 'en'
        }
    },

    // Subscription & Billing
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'pro', 'premium'],
            default: 'free'
        },
        stripeCustomerId: String,
        stripeSubscriptionId: String,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false
        }
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return this.name;
});

// Virtual for progress percentage
userSchema.virtual('progressPercentage').get(function() {
    // This would be calculated based on completed vs total modules
    return 0; // Placeholder
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ oauthProvider: 1, oauthId: 1 });
userSchema.index({ 'progress.lastActivity': -1 });
userSchema.index({ 'subscription.plan': 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        }
    );
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return token;
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return token;
};

// Instance method to update progress
userSchema.methods.updateProgress = function(moduleId, topicId, points = 0) {
    if (moduleId && !this.progress.completedModules.includes(moduleId)) {
        this.progress.completedModules.push(moduleId);
    }

    if (topicId && !this.progress.completedTopics.includes(topicId)) {
        this.progress.completedTopics.push(topicId);
    }

    if (points > 0) {
        this.progress.totalPoints += points;
    }

    this.progress.lastActivity = Date.now();
    return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

module.exports = mongoose.model('User', userSchema);