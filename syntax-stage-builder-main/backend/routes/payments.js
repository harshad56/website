const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateToken, requireSubscription } = require('../middleware/auth');
const { db } = require('../config/supabase');
const winston = require('winston');

const router = express.Router();

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async(req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        winston.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            default:
                winston.info(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        winston.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
});

// Create subscription
router.post('/create-subscription', authenticateToken, async(req, res) => {
    try {
        const { priceId, paymentMethodId } = req.body;

        if (!priceId || !paymentMethodId) {
            return res.status(400).json({
                success: false,
                message: 'Price ID and payment method ID are required'
            });
        }

        const user = req.user;

        // Create or get Stripe customer
        let customer;
        if (user.stripe_customer_id) {
            customer = await stripe.customers.retrieve(user.stripe_customer_id);
        } else {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });

            // Update user with customer ID
            await db.updateUser(user.id, {
                stripe_customer_id: customer.id
            });
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        // Update user subscription
        const subscriptionData = {
            stripe_subscription_id: subscription.id,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            plan: getPlanFromPriceId(priceId)
        };

        await db.updateUser(user.id, subscriptionData);

        res.json({
            success: true,
            data: {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            }
        });
    } catch (error) {
        winston.error('Create subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subscription'
        });
    }
});

// Get subscription status
router.get('/subscription', authenticateToken, async(req, res) => {
    try {
        const user = req.user;

        if (!user.stripe_subscription_id) {
            return res.json({
                success: true,
                data: {
                    hasSubscription: false,
                    plan: 'free'
                }
            });
        }

        const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

        res.json({
            success: true,
            data: {
                hasSubscription: true,
                plan: user.plan || 'free',
                status: subscription.status,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end
            }
        });
    } catch (error) {
        winston.error('Get subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscription'
        });
    }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async(req, res) => {
    try {
        const user = req.user;

        if (!user.stripe_subscription_id) {
            return res.status(400).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        const subscription = await stripe.subscriptions.update(user.stripe_subscription_id, {
            cancel_at_period_end: true
        });

        res.json({
            success: true,
            message: 'Subscription will be canceled at the end of the current period'
        });
    } catch (error) {
        winston.error('Cancel subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription'
        });
    }
});

// Get payment methods
router.get('/payment-methods', authenticateToken, async(req, res) => {
    try {
        const user = req.user;

        if (!user.stripe_customer_id) {
            return res.json({
                success: true,
                data: []
            });
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripe_customer_id,
            type: 'card'
        });

        res.json({
            success: true,
            data: paymentMethods.data
        });
    } catch (error) {
        winston.error('Get payment methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment methods'
        });
    }
});

// Helper function to get plan from price ID
function getPlanFromPriceId(priceId) {
    const planMap = {
        'price_free': 'free',
        'price_pro': 'pro',
        'price_premium': 'premium'
    };
    return planMap[priceId] || 'free';
}

// Webhook handlers
async function handleSubscriptionCreated(subscription) {
    try {
        const user = await db.getUserByStripeCustomerId(subscription.customer);
        if (user) {
            await db.updateUser(user.id, {
                stripe_subscription_id: subscription.id,
                plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000)
            });
        }
    } catch (error) {
        winston.error('Handle subscription created error:', error);
    }
}

async function handleSubscriptionUpdated(subscription) {
    try {
        const user = await db.getUserByStripeCustomerId(subscription.customer);
        if (user) {
            await db.updateUser(user.id, {
                plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000)
            });
        }
    } catch (error) {
        winston.error('Handle subscription updated error:', error);
    }
}

async function handleSubscriptionDeleted(subscription) {
    try {
        const user = await db.getUserByStripeCustomerId(subscription.customer);
        if (user) {
            await db.updateUser(user.id, {
                plan: 'free',
                stripe_subscription_id: null,
                current_period_start: null,
                current_period_end: null
            });
        }
    } catch (error) {
        winston.error('Handle subscription deleted error:', error);
    }
}

async function handlePaymentSucceeded(invoice) {
    try {
        const user = await db.getUserByStripeCustomerId(invoice.customer);
        if (user) {
            winston.info(`Payment succeeded for user ${user.id}`);
        }
    } catch (error) {
        winston.error('Handle payment succeeded error:', error);
    }
}

async function handlePaymentFailed(invoice) {
    try {
        const user = await db.getUserByStripeCustomerId(invoice.customer);
        if (user) {
            winston.warn(`Payment failed for user ${user.id}`);
        }
    } catch (error) {
        winston.error('Handle payment failed error:', error);
    }
}

// Handle one‑time course payments completed via Checkout
async function handleCheckoutSessionCompleted(session) {
    try {
        const courseId = session.metadata?.course_id;
        const userId = session.metadata?.user_id;

        if (!courseId || !userId) {
            winston.warn('checkout.session.completed missing metadata course_id or user_id');
            return;
        }

        // Avoid duplicate enrollments
        const existing = await db.getEnrollment(userId, courseId);
        if (existing) {
            return;
        }

        await db.createEnrollment({
            user_id: userId,
            course_id: courseId,
            payment_status: 'paid',
            payment_id: session.payment_intent || session.id,
            progress_percentage: 0
        });

        winston.info(`Enrollment created from checkout.session.completed for user ${userId} course ${courseId}`);
    } catch (error) {
        winston.error('Handle checkout.session.completed error:', error);
    }
}

module.exports = router;