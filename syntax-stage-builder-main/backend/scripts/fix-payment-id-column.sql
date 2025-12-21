-- Fix payment_id column to accept Razorpay payment ID strings (not just UUIDs)
-- Razorpay payment IDs are strings like "pay_xxxxxxxxxxxxx", not UUIDs

ALTER TABLE public.user_course_enrollments 
ALTER COLUMN payment_id TYPE VARCHAR(255);

-- Add a comment to document this
COMMENT ON COLUMN public.user_course_enrollments.payment_id IS 'Payment transaction ID from payment gateway (Razorpay, Stripe, etc.). Can be UUID or gateway-specific string ID.';

