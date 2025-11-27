const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const companyController = require('../controllers/companyController');

/********************
 * Company Routes
 ********************/

// Get all companies
router.get('/', util.verifyUser, companyController.getAllCompanies);

// Search companies
router.get('/search', util.verifyUser, companyController.searchCompanies);

// Get company by ID
router.get('/:id', util.verifyUser, companyController.getCompanyById);

// Create company
router.post(
  '/',
  util.verifyUser,
  util.verifyAdmin,
  companyController.createCompany
);

// Update company
router.put(
  '/:id',
  util.verifyUser,
  util.verifyAdmin,
  companyController.updateCompany
);

// Delete company
router.delete(
  '/:id',
  util.verifyUser,
  util.verifyAdmin,
  companyController.deleteCompany
);

/********************
 * Production Goals Routes
 ********************/

// Get all production goals for the authenticated user's company
router.get(
  '/production-goals/company',
  util.verifyUser,
  companyController.getProductionGoalsByCompanyId
);

// Get active production goals
router.get(
  '/production-goals/active',
  util.verifyUser,
  companyController.getActiveProductionGoals
);

// Get production goals by date range
router.get(
  '/production-goals/date-range',
  util.verifyUser,
  companyController.getProductionGoalsByDateRange
);

// Get production goals by product ID
router.get(
  '/production-goals/product/:productId',
  util.verifyUser,
  companyController.getProductionGoalsByProductId
);

// Get production goal by ID
router.get(
  '/production-goals/:id',
  util.verifyUser,
  companyController.getProductionGoalById
);

// Create production goal
router.post(
  '/production-goals',
  util.verifyUser,
  util.verifyWorker,
  companyController.createProductionGoal
);

// Update production goal
router.put(
  '/production-goals/:id',
  util.verifyUser,
  util.verifyAdmin,
  companyController.updateProductionGoal
);

// Delete production goal
router.delete(
  '/production-goals/:id',
  util.verifyUser,
  util.verifyAdmin,
  companyController.deleteProductionGoal
);

module.exports = router;
