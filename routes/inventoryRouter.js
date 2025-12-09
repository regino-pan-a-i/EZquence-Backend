const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const inventoryController = require('../controllers/inventoryController');

/********************
 * GET routes
 ********************/

// Get all materials for the company
router.get(
  '/',
  util.verifyUser,
  util.verifyWorker,
  inventoryController.getMaterialList
);

// Get today's material needs
router.get('/needs/today', inventoryController.getDailyMaterialNeeds);

// Get specific material details
router.get('/:id', util.verifyUser, inventoryController.getMaterialDetails);

// Search materials
router.get(
  '/search/query',
  util.verifyUser,
  inventoryController.searchMaterials
);

// Get all processes that use this mateerial
router.get(
  '/:id/processes',
  util.verifyUser,
  inventoryController.getProcessesByMaterialId
);

/********************
 * POST routes
 ********************/

// Create Material
router.post(
  '/createMaterial',
  util.verifyUser,
  inventoryController.createMaterial
);

/********************
 * PUT routes
 ********************/

// Update Material details
router.put('/:id', util.verifyUser, inventoryController.updateMaterial);

// Adjust material quantity (inventory adjustment)
router.put(
  '/:id/adjust',
  util.verifyUser,
  inventoryController.adjustMaterialQuantity
);

/********************
 * DELETE routes
 ********************/

// Delete Material by id
router.delete(
  '/:id/delete',
  util.verifyUser,
  inventoryController.deleteMaterial
);

/********************
 * Inventory Transaction Routes
 ********************/

// GET: Get all transactions for the company
router.get(
  '/transactions',
  util.verifyUser,
  inventoryController.getTransactionList
);

// GET: Get specific transaction details
router.get(
  '/transactions/:id',
  util.verifyUser,
  inventoryController.getTransactionDetails
);

// GET: Get transactions by product ID
router.get(
  '/transactions/product/:productId',
  util.verifyUser,
  inventoryController.getTransactionsByProduct
);

// POST: Create new transaction
router.post(
  '/transactions',
  util.verifyUser,
  inventoryController.createTransaction
);

// PUT: Update transaction
router.put(
  '/transactions/:id',
  util.verifyUser,
  inventoryController.updateTransaction
);

// DELETE: Delete transaction
router.delete(
  '/transactions/:id',
  util.verifyUser,
  inventoryController.deleteTransaction
);

// GET: Get current stock for a product
router.get(
  '/stock/:productId',
  util.verifyUser,
  inventoryController.getProductStock
);

module.exports = router;
