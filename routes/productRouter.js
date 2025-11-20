const express = require('express');
const router = express.Router();
const util = require('../utils/index')

// Import Controllers
const productController = require('../controllers/productController');
const { verify } = require('jsonwebtoken');

/********************
 * GET routes
********************/

// Get Product list
router.get('/', util.verifyUser, productController.getProductList);

// Get today's product needs
router.get('/needs/today', util.verifyUser, util.verifyWorker, productController.getCurrentProductNeed);

// Get Product details
router.get('/:id', util.verifyUser, productController.getProductDetails)

// Get Product Process
router.get('/:id/process', util.verifyUser, util.verifyWorker, productController.getProductProcess)

/********************
 * POST routes
********************/

// Create Product
router.post('/createProduct', util.verifyUser, util.verifyWorker, productController.createProduct)

// Create Product Process
router.post('/:id/createProcess', util.verifyUser, util.verifyWorker, productController.createProcess)


/********************
 * PUT routes
********************/

// Update Product details
router.put('/:id', util.verifyUser, util.verifyAdmin, productController.updateProduct)

// Update Product process
router.put('/:id/updateProcess', util.verifyUser, util.verifyAdmin, productController.updateProcess)

/********************
 * DELETE routes
********************/

// Delete Product by id
router.delete('/:id', util.verifyUser, util.verifyAdmin, productController.deleteProduct)

// Delete Product Process
router.delete('/:id/deleteProcess', util.verifyUser, util.verifyAdmin, productController.deleteProcessByProductId)

module.exports = router;