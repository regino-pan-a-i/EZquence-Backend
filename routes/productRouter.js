const express = require('express');
const router = express.Router();
const util = require('../utilites/tripValidation')

// Import Error Handler
const utilHandler = require('../utilities/index')

// Import Controllers
const productController = require('../controllers/productController')

/********************
 * GET routes
********************/

// Get Product list
router.get('/', ()=>{})

// Get Product details
router.get('/:id', ()=>{})

// Get Product Process
router.get('/:id/process', ()=>{})

/********************
 * POST routes
********************/

// Create Product
router.post('/createProduct', ()=>{})

// Create Product Process
router.post('/:id/createProcess', ()=>{})


/********************
 * PUT routes
********************/

// Update Product details
router.put('/:id', ()=>{})

// Update Product details
router.put('/:id/updateProcess', ()=>{})

/********************
 * DELETE routes
********************/

// Delete Product by id
router.delete('/:id', ()=>{})

// Delete Product Process
router.delete('/:id/delteProcess', ()=>{})

module.exports = router;