const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Error Handler
const utilHandler = require('../utils/index');

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

module.exports = router;
