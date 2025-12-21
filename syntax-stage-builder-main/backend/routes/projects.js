const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const winston = require('winston');
const { db } = require('../config/supabase');
const { authenticateToken, optionalAuth, authorize } = require('../middleware/auth');

const router = express.Router();

// Lazy init Razorpay
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// List projects (public - only active, admin - all)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Admin can see all projects, public users only see active ones
    const includeInactive = req.user && req.user.role === 'admin';
    const projects = await db.getProjects(includeInactive);
    res.json({ success: true, data: projects });
  } catch (error) {
    winston.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Admin: stats (must be before /:id route)
router.get('/stats/summary', authenticateToken, authorize('admin'), async (_req, res) => {
  try {
    const stats = await db.getProjectStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    winston.error('Get project stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project stats' });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await db.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    winston.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// Admin: create project
router.post('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const project = await db.createProject(req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    winston.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// Admin: update project
router.put('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const project = await db.updateProject(req.params.id, req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    winston.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// Admin: delete project
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await db.deleteProject(req.params.id);
    res.json({ success: true });
  } catch (error) {
    winston.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// Create checkout/order (must be before /:id route to avoid conflicts)
router.post('/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    
    winston.info(`Creating checkout for project ${projectId}, user ${userId}`);
    
    let project;
    try {
      project = await db.getProjectById(projectId);
    } catch (dbError) {
      winston.error('Database error fetching project:', {
        error: dbError.message,
        stack: dbError.stack,
        projectId
      });
      
      // If Supabase is not configured, return error
      if (dbError.message?.includes('Supabase not configured')) {
        winston.error('Supabase not configured');
        return res.status(500).json({
          success: false,
          message: 'Database not configured. Please configure Supabase.',
        });
      }
      
      throw dbError;
    }

    if (!project) {
      winston.warn(`Project not found: ${projectId}`);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    winston.info(`Project found: ${project.title}, price: ${project.price}`);

    // Convert price to number if it's a string
    const price = typeof project.price === 'string' ? parseFloat(project.price) : (Number(project.price) || 0);

    // Free project, no order needed - but still return proper format
    if (!price || price === 0 || isNaN(price)) {
      winston.info(`Free project checkout for ${projectId}`);
      return res.json({ 
        success: true, 
        data: { 
          amount: 0, 
          currency: 'INR', 
          order_id: `free-${Date.now()}`,
          razorpayOrderId: `free-${Date.now()}`,
          key: process.env.RAZORPAY_KEY_ID,
          keyId: process.env.RAZORPAY_KEY_ID,
        } 
      });
    }

    const razorpay = getRazorpay();
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    
    if (!razorpay) {
      winston.error(`Razorpay not configured for project ${projectId}`);
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please configure Razorpay keys.',
      });
    }

    try {
      winston.info(`Creating Razorpay order for project ${projectId}`, {
        amount: Math.round(price * 100),
        currency: 'INR',
        hasKeyId: !!razorpayKeyId
      });

      // Create a short receipt (Razorpay limit is 40 characters)
      // Format: proj_<short_id>_<timestamp> (max 22 chars: proj_ + 8 + _ + 8)
      const shortProjectId = projectId.substring(0, 8);
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits
      const receipt = `proj_${shortProjectId}_${timestamp}`;
      
      winston.info(`Creating order with receipt: ${receipt} (length: ${receipt.length})`);
      
      const order = await razorpay.orders.create({
        amount: Math.round(price * 100),
        currency: 'INR',
        receipt: receipt.substring(0, 40), // Ensure it's max 40 chars
      });

      winston.info(`Razorpay order created: ${order.id} for project ${projectId}`);

      res.json({
        success: true,
        data: {
          key: razorpayKeyId,
          keyId: razorpayKeyId,
          order_id: order.id,
          razorpayOrderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      });
    } catch (razorpayError) {
      winston.error('Razorpay order creation error:', {
        error: razorpayError.message,
        errorCode: razorpayError.error?.code,
        errorDescription: razorpayError.error?.description,
        stack: razorpayError.stack,
        projectId,
        amount: Math.round(price * 100)
      });
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (razorpayError.error?.description || razorpayError.message) : undefined,
        errorCode: process.env.NODE_ENV === 'development' ? razorpayError.error?.code : undefined
      });
    }
  } catch (error) {
    winston.error('Create project checkout error:', {
      error: error.message,
      stack: error.stack,
      projectId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify payment
router.post('/:id/payment/verify', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    winston.info(`Verifying payment for project ${projectId}, user ${userId}`, {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      has_signature: !!razorpay_signature
    });

    const project = await db.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Verify Razorpay signature
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        winston.warn(`Invalid signature for payment verification`, {
          projectId,
          userId,
          order_id: razorpay_order_id,
          expected: expectedSignature.substring(0, 10) + '...',
          received: razorpay_signature?.substring(0, 10) + '...'
        });
        return res.status(400).json({ success: false, message: 'Invalid signature' });
      }
      winston.info(`Signature verified successfully for order ${razorpay_order_id}`);
    } else {
      winston.warn('Missing payment verification data', {
        has_secret: !!process.env.RAZORPAY_KEY_SECRET,
        has_order_id: !!razorpay_order_id,
        has_payment_id: !!razorpay_payment_id,
        has_signature: !!razorpay_signature
      });
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    let purchase;
    try {
      purchase = await db.getProjectPurchase(userId, projectId);
    } catch (getError) {
      winston.error('Error getting project purchase:', {
        error: getError.message,
        projectId,
        userId
      });
      // Continue to create a new purchase if get fails
      purchase = null;
    }

    if (!purchase) {
      try {
        // Ensure amount is correctly set in rupees (project.price is already in rupees)
        const purchaseAmount = Number(project.price || 0);
        winston.info(`Creating purchase record with amount: ₹${purchaseAmount} for project ${projectId}`);
        
        purchase = await db.createProjectPurchase({
        user_id: userId,
        project_id: projectId,
        amount: purchaseAmount, // Amount in rupees
        payment_status: 'completed',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        });
        winston.info(`Created purchase for project ${projectId}, user ${userId}, amount: ₹${purchaseAmount}`);
      } catch (createError) {
        // If creation fails (e.g., duplicate), try to get the purchase again
        winston.warn('Failed to create purchase, trying to get existing:', createError.message);
        try {
          purchase = await db.getProjectPurchase(userId, projectId);
          if (purchase) {
            winston.info(`Found existing purchase after creation failure for project ${projectId}, user ${userId}`);
          }
        } catch (retryError) {
          throw new Error(`Failed to create or retrieve purchase: ${createError.message}`);
        }
      }
    } else {
      winston.info(`Updating existing purchase record: ${purchase.id}`);
      try {
        // Update with payment status and ensure amount is set correctly if it's missing or 0
        const updateData = {
          payment_status: 'completed',
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
        };
        
        // Ensure amount is set correctly (in case it was missing or 0)
        const currentAmount = Number(purchase.amount || 0);
        const projectAmount = Number(project.price || 0);
        if (currentAmount === 0 && projectAmount > 0) {
          updateData.amount = projectAmount;
          winston.info(`Updating project purchase amount from ₹${currentAmount} to ₹${projectAmount}`);
        }
        
        purchase = await db.updateProjectPurchase(purchase.id, updateData);
        const finalAmount = updateData.amount || purchase.amount;
        winston.info(`Updated existing purchase for project ${projectId}, user ${userId}, amount: ₹${finalAmount || 'unchanged'}`);
      } catch (updateError) {
        winston.error('Error updating purchase:', {
          error: updateError.message,
          purchaseId: purchase.id,
          projectId,
          userId
        });
        // If update fails, return the existing purchase
        winston.warn('Using existing purchase data after update failure');
      }
    }

    res.json({ success: true, data: { purchase } });
  } catch (error) {
    winston.error('Verify payment error:', {
      error: error.message,
      stack: error.stack,
      projectId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Download project (requires purchase if paid)
router.post('/:id/download', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await db.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.price > 0) {
      // Try multiple times to get the purchase (in case it's still being saved)
      let purchase = null;
      const maxRetries = 5;
      for (let i = 0; i < maxRetries; i++) {
        purchase = await db.getProjectPurchase(userId, projectId);
        if (purchase && (purchase.payment_status === 'completed' || purchase.payment_status === 'free')) {
          break;
        }
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms between retries
        }
      }

      if (!purchase || (purchase.payment_status !== 'completed' && purchase.payment_status !== 'free')) {
        winston.warn(`Download denied for project ${projectId}, user ${userId}. Purchase status:`, purchase?.payment_status || 'not found');
        return res.status(403).json({ 
          success: false, 
          message: 'You must purchase this project before downloading. Please wait a moment and try again.' 
        });
      }
      winston.info(`Download allowed for project ${projectId}, user ${userId}, purchase status: ${purchase.payment_status}`);
    }

    await db.trackProjectDownload(userId, projectId);
    
    winston.info(`Download request for project ${projectId}, user ${userId}`, {
      has_download_url: !!project.download_url,
      has_setup_pdf_url: !!project.setup_pdf_url
    });
    
    if (!project.download_url && !project.setup_pdf_url) {
      winston.warn(`No download URLs configured for project ${projectId}`);
      return res.status(404).json({ 
        success: false, 
        message: 'Download URLs are not configured for this project. Please contact support.' 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        download_url: project.download_url || null, 
        setup_pdf_url: project.setup_pdf_url || null 
      } 
    });
  } catch (error) {
    winston.error('Download project error:', {
      error: error.message,
      stack: error.stack,
      projectId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process download',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

