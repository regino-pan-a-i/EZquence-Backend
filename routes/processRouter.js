const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const processController = require('../controllers/processController');

/********************
 * GET routes
 ********************/

// Get process materials by process ID
router.get(
  '/:id/materials',
  util.verifyUser,
  processController.getProcessMaterials
);

router.get(
  '/all',
  util.verifyUser,
  util.verifyUser,
  processController.getProcessList
)

/********************
 * POST routes
 ********************/

// Create a new process
router.post(
  '/',
  util.verifyUser,
  util.verifyAdmin,
  processController.createProcess
);

router.post(
  '/materials/add',
  util.verifyUser,
  util.verifyAdmin,
  processController.addMaterialToMaterialList
);

/********************
 * PUT routes
 ********************/

// Update material in process by material ID
router.put(
  '/:processId/materials/:materialId',
  util.verifyUser,
  util.verifyAdmin,
  processController.updateProcessMaterial
);

/********************
 * DELETE routes
 ********************/

// Delete a process by product ID
router.delete(
  '/product/:id',
  util.verifyUser,
  util.verifyAdmin,
  processController.deleteProcess
);

// Delete a Material from a process' material list
router.delete(
  '/:processId/materials/:materialId',
  util.verifyUser,
  util.verifyAdmin,
  processController.deleteMaterialFromMaterialList
);

module.exports = router;
