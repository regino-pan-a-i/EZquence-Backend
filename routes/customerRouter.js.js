const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const customerController = require('../controllers/customerController');

/********************
 * Cart Routes
 ********************/

/**
 * GET /cart
 * Get or create active cart for current user
 */
router.post(
  '/create-payment-intent',
  util.verifyUser,
  customerController.createPaymentIntent
);

module.exports = router;
