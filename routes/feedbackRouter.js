const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const feedbackController = require('../controllers/feedbackController');

/********************
 * Feedback Routes
 ********************/

// Create new feedback (Authenticated customers)
router.post('/', util.verifyUser, feedbackController.createFeedback);

// Get feedback by user ID (Authenticated customers - their own feedback)
router.get(
  '/my-feedback',
  util.verifyUser,
  feedbackController.getFeedbackByUserId
);

// Get all feedback for a company (Admin only)
router.get(
  '/company',
  util.verifyUser,
  util.verifyAdmin,
  feedbackController.getFeedbackByCompanyId
);

// Update feedback resolved status (Admin only)
router.patch(
  '/:feedbackId/resolved',
  util.verifyUser,
  util.verifyAdmin,
  feedbackController.updateFeedbackResolved
);

module.exports = router;
