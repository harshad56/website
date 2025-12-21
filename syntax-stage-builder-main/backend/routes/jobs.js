const express = require('express');
const winston = require('winston');
const { db } = require('../config/supabase');
const { authenticateToken, optionalAuth, authorize } = require('../middleware/auth');

const router = express.Router();

// List jobs (public - only active, admin - all)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Admin can see all jobs, public users only see active ones
    const includeInactive = req.user && req.user.role === 'admin';
    const jobs = await db.getJobs(includeInactive);
    res.json({ success: true, data: jobs });
  } catch (error) {
    winston.error('Get jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: stats
router.get('/stats/summary', authenticateToken, authorize('admin'), async (_req, res) => {
  try {
    const stats = await db.getJobStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    winston.error('Get job stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job stats' });
  }
});

// Share job (generate shareable link) - keep before "/:id" route
router.get('/:id/share', async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await db.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    const frontendBase = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const shareUrl = `${frontendBase.replace(/\/+$/, '')}/jobs/${jobId}`;
    res.json({ 
      success: true, 
      data: { 
        shareUrl,
        title: job.title,
        company: job.company
      } 
    });
  } catch (error) {
    winston.error('Share job error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate share link' });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await db.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    winston.error('Get job error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
});

// Admin: create job
router.post('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    winston.info('Creating job with data:', JSON.stringify(req.body, null, 2));
    const job = await db.createJob(req.body);
    winston.info('Job created successfully:', job.id);
    res.json({ success: true, data: job });
  } catch (error) {
    winston.error('Create job error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: update job
router.put('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    winston.info(`Updating job ${req.params.id} with data:`, JSON.stringify(req.body, null, 2));
    const job = await db.updateJob(req.params.id, req.body);
    winston.info('Job updated successfully:', job.id);
    res.json({ success: true, data: job });
  } catch (error) {
    winston.error('Update job error:', {
      error: error.message,
      stack: error.stack,
      jobId: req.params.id,
      body: req.body
    });
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin: delete job
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await db.deleteJob(req.params.id);
    res.json({ success: true });
  } catch (error) {
    winston.error('Delete job error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
});

// Apply for job (authenticated users)
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { cover_letter, resume_url } = req.body;

    winston.info(`User ${userId} applying for job ${jobId}`);

    // Check if user already applied
    const existingApplication = await db.getJobApplication(userId, jobId);
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await db.createJobApplication({
      user_id: userId,
      job_id: jobId,
      cover_letter: cover_letter || null,
      resume_url: resume_url || null,
    });

    // Increment applications count
    await db.incrementJobApplicationsCount(jobId);

    winston.info(`Job application created: ${application.id}`);
    res.json({ success: true, data: application });
  } catch (error) {
    winston.error('Apply for job error:', {
      error: error.message,
      stack: error.stack,
      jobId: req.params.id,
      userId: req.user?.id
    });
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to apply for job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Save/unsave job (authenticated users)
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const saved = await db.saveJob(userId, jobId);
    res.json({ success: true, data: { saved } });
  } catch (error) {
    winston.error('Save job error:', error);
    res.status(500).json({ success: false, message: 'Failed to save job' });
  }
});

router.delete('/:id/save', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    await db.unsaveJob(userId, jobId);
    res.json({ success: true });
  } catch (error) {
    winston.error('Unsave job error:', error);
    res.status(500).json({ success: false, message: 'Failed to unsave job' });
  }
});

// Get user's saved jobs
router.get('/saved/list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const savedJobs = await db.getSavedJobs(userId);
    res.json({ success: true, data: savedJobs });
  } catch (error) {
    winston.error('Get saved jobs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch saved jobs' });
  }
});

// Get user's applications
router.get('/applications/list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await db.getUserJobApplications(userId);
    res.json({ success: true, data: applications });
  } catch (error) {
    winston.error('Get user applications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// User resumes - upload and analyze
router.post('/resumes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeUrl, rawText, preferredDomains } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'resumeUrl is required' });
    }

    const resume = await db.createUserResume({
      userId,
      resumeUrl,
      rawText: rawText || '',
      preferredDomains: preferredDomains || [],
    });

    const recommendations = await db.getJobRecommendationsForUser(userId);

    res.json({
      success: true,
      data: {
        resume,
        recommendations,
      },
    });
  } catch (error) {
    winston.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process resume',
    });
  }
});

// Get job recommendations for current user
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await db.getJobRecommendationsForUser(userId);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    winston.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
    });
  }
});

// Admin: view all resumes
router.get('/resumes/admin/list', authenticateToken, authorize('admin'), async (_req, res) => {
  try {
    const resumes = await db.getAllResumes();
    res.json({ success: true, data: resumes });
  } catch (error) {
    winston.error('Get all resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
    });
  }
});

module.exports = router;

