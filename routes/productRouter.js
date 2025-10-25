const express = require('express');
const router = express.Router();
const util = require('../utils/index')

// Import Controllers
const productController = require('../controllers/productController')

/********************
 * GET routes
********************/

// Get Product list
router.get('/', util.verifyUser, productController.getProductList);

// Get Product details
router.get('/:id', util.verifyUser, productController.getProductDetails)

// Get Product Process
router.get('/:id/process', util.verifyUser, util.verifyWorker, productController.getProductProcess)

/********************
 * POST routes
********************/

// Create Product
router.post('/createProduct', productController.createProduct)

// Create Product Process
router.post('/:id/createProcess', productController.createProcess)


/********************
 * PUT routes
********************/

// Update Product details
router.put('/:id', productController.updateProduct)

// Update Product process
router.put('/:id/updateProcess', productController.updateProcess)

/********************
 * DELETE routes
********************/

// Delete Product by id
router.delete('/:id', productController.deleteProduct)

// Delete Product Process
router.delete('/:id/deleteProcess', productController.deleteProcessByProductId)

module.exports = router;