const express = require('express');
const router = express.Router();
const util = require('../utilites/tripValidation')

// Import Error Handler
const utilHandler = require('../utilities/index')

// Import Controllers
const orderController = require('../controllers/orderController')

/********************
 * GET routes
********************/

// Get today's Order list
router.get('/day', ()=>{})

// Get Order list by date range
router.get('/dateRange', ()=>{})


// Get Order details
router.get('/:id', ()=>{})

// Get Order status
router.get('/:id/status', ()=>{})

/********************
 * POST routes
********************/

// Create Order
router.post('/createOrder', ()=>{})


/********************
 * PUT routes
********************/

// Update Order details
router.put('/:id', ()=>{})

// Update Order status
router.put('/:id/status', ()=>{})

/********************
 * DELETE routes
********************/

// Delete Order by id
router.delete('/:id/delete', ()=>{})

module.exports = router;