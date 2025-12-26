const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const winston = require('winston');
const { db } = require('../config/supabase');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// List study materials (public - only active, admin - all)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Admin can see all materials, public users only see active ones
    const includeInactive = req.user && req.user.role === 'admin';

    winston.info(`Fetching study materials (includeInactive: ${includeInactive}, user: ${req.user ? req.user.email : 'anonymous'})`);
    // Sanitize URLs helper
    const sanitizeUrl = (url) => {
      if (!url) return null;
      if (process.env.BACKEND_URL && url.includes('localhost:5000')) {
        return url.replace(/http:\/\/localhost:5000/g, process.env.BACKEND_URL)
          .replace(/https:\/\/localhost:5000/g, process.env.BACKEND_URL);
      }
      return url;
    };

    const sanitizeMaterial = (mat) => ({
      ...mat,
      imageUrl: sanitizeUrl(mat.image_url || mat.imageUrl), // Handle case nuances
      image_url: sanitizeUrl(mat.image_url || mat.imageUrl),
      file_url: sanitizeUrl(mat.file_url),
      setup_pdf_url: sanitizeUrl(mat.setup_pdf_url)
    });

    const materials = await db.getStudyMaterials(includeInactive);
    winston.info(`Fetched ${materials.length} study materials`);

    // Sanitize all materials
    const sanitizedMaterials = materials.map(sanitizeMaterial);

    res.json({ success: true, data: sanitizedMaterials });
  } catch (error) {
    winston.error('Get study materials error:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch study materials',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: stats
router.get('/stats/summary', authenticateToken, authorize('admin'), async (_req, res) => {
  try {
    const stats = await db.getStudyMaterialStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    winston.error('Get study material stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch study material stats' });
  }
});

// Get single study material (public)
router.get('/:id', async (req, res) => {
  try {
    const material = await db.getStudyMaterialById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    // Sanitize URLs helper (duplicated for scope, could be refactored)
    const sanitizeUrl = (url) => {
      if (!url) return null;
      if (process.env.BACKEND_URL && url.includes('localhost:5000')) {
        return url.replace(/http:\/\/localhost:5000/g, process.env.BACKEND_URL)
          .replace(/https:\/\/localhost:5000/g, process.env.BACKEND_URL);
      }
      return url;
    };

    const sanitizedMaterial = {
      ...material,
      imageUrl: sanitizeUrl(material.image_url || material.imageUrl),
      image_url: sanitizeUrl(material.image_url || material.imageUrl),
      file_url: sanitizeUrl(material.file_url),
      setup_pdf_url: sanitizeUrl(material.setup_pdf_url)
    };

    res.json({ success: true, data: sanitizedMaterial });
  } catch (error) {
    winston.error('Get study material error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch study material' });
  }
});

// Admin: create
router.post('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    // Sanitize any incoming localhost URLs from the frontend
    const sanitizeUrl = (url) => {
      if (!url) return url;
      if (process.env.BACKEND_URL && url.includes('localhost:5000')) {
        return url.replace(/https?:\/\/localhost:5000/g, process.env.BACKEND_URL);
      }
      return url;
    };

    const sanitizedBody = { ...req.body };
    if (sanitizedBody.image_url) sanitizedBody.image_url = sanitizeUrl(sanitizedBody.image_url);
    if (sanitizedBody.imageUrl) sanitizedBody.imageUrl = sanitizeUrl(sanitizedBody.imageUrl);
    if (sanitizedBody.file_url) sanitizedBody.file_url = sanitizeUrl(sanitizedBody.file_url);
    if (sanitizedBody.setup_pdf_url) sanitizedBody.setup_pdf_url = sanitizeUrl(sanitizedBody.setup_pdf_url);

    winston.info('Creating study material with sanitized data:', JSON.stringify(sanitizedBody, null, 2));
    const material = await db.createStudyMaterial(sanitizedBody);
    winston.info('Study material created successfully:', material.id);
    res.json({ success: true, data: material });
  } catch (error) {
    winston.error('Create study material error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create study material',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: update
router.put('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    // Sanitize any incoming localhost URLs from the frontend
    const sanitizeUrl = (url) => {
      if (!url) return url;
      if (process.env.BACKEND_URL && url.includes('localhost:5000')) {
        return url.replace(/https?:\/\/localhost:5000/g, process.env.BACKEND_URL);
      }
      return url;
    };

    const sanitizedBody = { ...req.body };
    if (sanitizedBody.image_url) sanitizedBody.image_url = sanitizeUrl(sanitizedBody.image_url);
    if (sanitizedBody.imageUrl) sanitizedBody.imageUrl = sanitizeUrl(sanitizedBody.imageUrl);
    if (sanitizedBody.file_url) sanitizedBody.file_url = sanitizeUrl(sanitizedBody.file_url);
    if (sanitizedBody.setup_pdf_url) sanitizedBody.setup_pdf_url = sanitizeUrl(sanitizedBody.setup_pdf_url);

    winston.info(`Updating study material ${req.params.id} with sanitized data:`, JSON.stringify(sanitizedBody, null, 2));
    const material = await db.updateStudyMaterial(req.params.id, sanitizedBody);
    winston.info('Study material updated successfully:', material.id);
    res.json({ success: true, data: material });
  } catch (error) {
    winston.error('Update study material error:', {
      error: error.message,
      stack: error.stack,
      materialId: req.params.id,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update study material',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: delete
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await db.deleteStudyMaterial(req.params.id);
    res.json({ success: true });
  } catch (error) {
    winston.error('Delete study material error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete study material' });
  }
});

// Create checkout/order
router.post('/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const materialId = req.params.id;
    const userId = req.user.id;
    const material = await db.getStudyMaterialById(materialId);

    if (!material) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    if (!material.price || material.price === 0) {
      return res.json({ success: true, data: { devMock: true, amount: 0, currency: 'INR', order_id: `free-${Date.now()}` } });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.json({
        success: true,
        data: {
          devMock: true,
          order_id: `mock_${Date.now()}`,
          amount: material.price * 100,
          currency: 'INR',
          key: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
        },
      });
    }

    // Create shorter receipt (Razorpay limit is 40 characters)
    const shortMaterialId = materialId.substring(0, 8);
    const shortUserId = userId.substring(0, 8);
    const timestamp = Date.now().toString().slice(-10);
    const receipt = `mat_${shortMaterialId}_${shortUserId}_${timestamp}`.substring(0, 40);

    winston.info(`Creating Razorpay order for study material ${materialId}, receipt: ${receipt}`);

    const order = await razorpay.orders.create({
      amount: Math.round(material.price * 100),
      currency: 'INR',
      receipt: receipt,
    });

    winston.info(`Razorpay order created: ${order.id}`);

    res.json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    winston.error('Create study material checkout error:', {
      error: error.message,
      stack: error.stack,
      materialId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify payment
router.post('/:id/payment/verify', authenticateToken, async (req, res) => {
  try {
    const materialId = req.params.id;
    const userId = req.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    winston.info(`Verifying payment for study material ${materialId} by user ${userId}`, {
      razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id ? 'present' : 'missing',
      razorpay_signature: razorpay_signature ? 'present' : 'missing'
    });

    const material = await db.getStudyMaterialById(materialId);
    if (!material) {
      winston.warn(`Study material not found: ${materialId}`);
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    // Verify signature first (before creating purchase record)
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        winston.warn(`Invalid signature for study material ${materialId}`);
        return res.status(400).json({ success: false, message: 'Invalid signature' });
      }
      winston.info(`Signature verified for study material ${materialId}`);
    }

    // Get or create purchase record
    let purchase = await db.getStudyMaterialPurchase(userId, materialId);

    if (!purchase) {
      winston.info(`Creating new purchase record for study material ${materialId}`);
      try {
        // Database uses material_id (not study_material_id) and requires order_id (NOT NULL)
        // The table only has: order_id, payment_id (not razorpay_order_id, razorpay_payment_id, razorpay_signature)
        // Ensure amount is correctly set in rupees (material.price is already in rupees)
        const purchaseAmount = Number(material.price || 0);
        winston.info(`Creating purchase record with amount: ₹${purchaseAmount} for material ${materialId}`);

        const purchaseData = {
          user_id: userId,
          material_id: materialId, // Database column is material_id (not study_material_id)
          amount: purchaseAmount, // Amount in rupees
          payment_status: 'completed',
          order_id: razorpay_order_id || `order_${Date.now()}`, // Required field, use Razorpay order ID or generate one
          payment_id: razorpay_payment_id || null
        };

        // Note: razorpay_order_id, razorpay_payment_id, razorpay_signature columns don't exist
        // The table only has order_id and payment_id columns

        purchase = await db.createStudyMaterialPurchase(purchaseData);
        winston.info(`Purchase record created: ${purchase.id}`);
      } catch (createError) {
        winston.error('Error creating purchase record:', {
          error: createError.message,
          stack: createError.stack,
          materialId,
          userId
        });
        throw createError;
      }
    } else {
      winston.info(`Updating existing purchase record: ${purchase.id}`);
      try {
        // Update with order_id and payment_id (these are the actual columns in the database)
        // Also ensure amount is set correctly if it's missing or 0
        const updateData = {
          payment_status: 'completed'
        };

        // Ensure amount is set correctly (in case it was missing or 0)
        const currentAmount = Number(purchase.amount || 0);
        const materialAmount = Number(material.price || 0);
        if (currentAmount === 0 && materialAmount > 0) {
          updateData.amount = materialAmount;
          winston.info(`Updating purchase amount from ₹${currentAmount} to ₹${materialAmount}`);
        }

        // Update order_id if provided (required field)
        if (razorpay_order_id) {
          updateData.order_id = razorpay_order_id;
        } else if (purchase.order_id) {
          updateData.order_id = purchase.order_id; // Keep existing if not provided
        }

        // Update payment_id if provided
        if (razorpay_payment_id) {
          updateData.payment_id = razorpay_payment_id;
        } else if (purchase.payment_id) {
          updateData.payment_id = purchase.payment_id; // Keep existing if not provided
        }

        // Note: razorpay_order_id, razorpay_payment_id, razorpay_signature columns don't exist
        // The table only has order_id and payment_id columns

        purchase = await db.updateStudyMaterialPurchase(purchase.id, updateData);
        const finalAmount = updateData.amount || purchase.amount;
        winston.info(`Purchase record updated: ${purchase.id}, amount: ₹${finalAmount || 'unchanged'}`);
      } catch (updateError) {
        winston.error('Error updating purchase record:', {
          error: updateError.message,
          stack: updateError.stack,
          purchaseId: purchase.id
        });
        throw updateError;
      }
    }

    winston.info(`Payment verified successfully for study material ${materialId}`);
    res.json({ success: true, data: { purchase } });
  } catch (error) {
    winston.error('Verify payment error:', {
      error: error.message,
      stack: error.stack,
      materialId: req.params.id,
      userId: req.user?.id,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Download study material
router.post('/:id/download', authenticateToken, async (req, res) => {
  try {
    const materialId = req.params.id;
    const userId = req.user.id;

    winston.info(`Download request for study material ${materialId} by user ${userId}`);

    const material = await db.getStudyMaterialById(materialId);
    if (!material) {
      winston.warn(`Study material not found: ${materialId}`);
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }

    if (material.price > 0) {
      // Retry logic to fetch purchase record (up to 5 attempts with 500ms delay)
      let purchase = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        purchase = await db.getStudyMaterialPurchase(userId, materialId);

        if (purchase && (purchase.payment_status === 'completed' || purchase.payment_status === 'free')) {
          winston.info(`Purchase found for study material ${materialId}, attempt ${attempts + 1}`);
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          winston.info(`Purchase not found, retrying... (attempt ${attempts}/${maxAttempts})`);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (!purchase || (purchase.payment_status !== 'completed' && purchase.payment_status !== 'free')) {
        winston.warn(`No valid purchase found for study material ${materialId} by user ${userId}`);
        return res.status(403).json({ success: false, message: 'You must purchase this study material before downloading' });
      }
    }

    await db.trackStudyMaterialDownload(userId, materialId);

    // Sanitize URLs to use correct backend URL in production
    const sanitizeUrl = (url) => {
      if (!url) return null;
      if (process.env.BACKEND_URL && url.includes('localhost:5000')) {
        return url.replace(/http:\/\/localhost:5000/g, process.env.BACKEND_URL)
          .replace(/https:\/\/localhost:5000/g, process.env.BACKEND_URL);
      }
      return url;
    };

    const downloadData = {
      download_url: sanitizeUrl(material.file_url),
      setup_pdf_url: sanitizeUrl(material.setup_pdf_url)
    };

    if (!downloadData.download_url && !downloadData.setup_pdf_url) {
      winston.warn(`No download URLs configured for study material ${materialId}`);
      return res.status(404).json({ success: false, message: 'Download URLs are not configured for this material' });
    }

    winston.info(`Download URLs returned for study material ${materialId}`);
    res.json({ success: true, data: downloadData });
  } catch (error) {
    winston.error('Download study material error:', {
      error: error.message,
      stack: error.stack,
      materialId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process download',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

