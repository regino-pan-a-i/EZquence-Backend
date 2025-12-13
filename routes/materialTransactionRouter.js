const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const materialTransactionController = require('../controllers/materialTransactionController');

/********************
 * GET routes
 ********************/

// Get all material transactions for the company
router.get(
  '/',
  util.verifyUser,
  util.verifyAdmin,
  materialTransactionController.getAllMaterialTransactions
);

// Get material transactions by date range
// Query params: startDate, endDate (ISO format: YYYY-MM-DD)
router.get(
  '/dateRange',
  util.verifyUser,
  util.verifyAdmin,
  materialTransactionController.getMaterialTransactionsByDateRange
);

/********************
 * POST routes
 ********************/

// Create a new material transaction
router.post(
  '/create',
  util.verifyUser,
  util.verifyAdmin,
  materialTransactionController.createMaterialTransaction
);

/********************
 * PUT routes
 ********************/

/********************
 * DELETE routes
 ********************/

module.exports = router;
