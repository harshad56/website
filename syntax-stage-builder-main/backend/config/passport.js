const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { db } = require('./supabase');

const getBackendBaseUrl = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const getCallbackURL = (providerPath) => {
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    return `${backendUrl}${providerPath}`;
};

const createPlaceholderPassword = async () => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(uuidv4(), salt);
};

const configureGoogleStrategy = () => {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        winston.warn('Google OAuth not configured. Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.');
        return;
    }

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: getCallbackURL('/api/auth/google/callback')
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                winston.info(`🔐 Processing Google OAuth for email: ${email}`);

                if (!email) {
                    return done(new Error('Google profile does not include an email address'));
                }

                let user = await db.getUserByEmail(email);

                if (!user) {
                    const hashedPassword = await createPlaceholderPassword();
                    const newUserData = {
                        id: uuidv4(),
                        name: profile.displayName || email.split('@')[0],
                        email,
                        password: hashedPassword,
                        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                        email_verified: true,
                        oauth_provider: 'google',
                        oauth_id: profile.id,
                        is_active: true,
                        role: 'student',
                        created_at: new Date(),
                        updated_at: new Date()
                    };

                    user = await db.createUser(newUserData);
                } else if (user.oauth_provider !== 'google' || !user.oauth_id) {
                    user = await db.updateUser(user.id, {
                        oauth_provider: 'google',
                        oauth_id: profile.id,
                        email_verified: true,
                        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : user.avatar
                    });
                }

                return done(null, user);
            } catch (error) {
                winston.error('Google OAuth error:', error);
                return done(error, null);
            }
        }
    ));
};

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.getUserById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    const configureGitHubStrategy = () => {
        const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

        if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
            winston.warn('GitHub OAuth not configured. Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET.');
            return;
        }

        passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: getCallbackURL('/api/auth/github/callback'),
            scope: ['user:email']
        },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email =
                        (profile.emails && profile.emails.find((entry) => entry.value)?.value) ||
                        `${profile.username}@users.noreply.github.com`;

                    let user = await db.getUserByEmail(email);

                    if (!user) {
                        const hashedPassword = await createPlaceholderPassword();
                        const newUserData = {
                            id: uuidv4(),
                            name: profile.displayName || profile.username || email.split('@')[0],
                            email,
                            password: hashedPassword,
                            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                            email_verified: true,
                            oauth_provider: 'github',
                            oauth_id: profile.id,
                            is_active: true,
                            role: 'student',
                            created_at: new Date(),
                            updated_at: new Date()
                        };

                        user = await db.createUser(newUserData);
                    } else if (user.oauth_provider !== 'github' || !user.oauth_id) {
                        user = await db.updateUser(user.id, {
                            oauth_provider: 'github',
                            oauth_id: profile.id,
                            email_verified: true,
                            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : user.avatar
                        });
                    }

                    return done(null, user);
                } catch (error) {
                    winston.error('GitHub OAuth error:', error);
                    return done(error, null);
                }
            }
        ));
    };

    configureGoogleStrategy();
    configureGitHubStrategy();
};

