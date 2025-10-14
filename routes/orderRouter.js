const express = require('express');
const router = express.Router();
const util = require('../utils/index')

// Import Error Handler
const utilHandler = require('../utils/index')

// Import Controllers
const orderController = require('../controllers/orderController')

/********************
 * GET routes
********************/

// Get today's Order list
router.get('/', (req, res) => {
    res.send('Welcome to the Order Router');
});

// Get today's Order list
router.get('/day', ()=>{})

// Get Order list by date range
router.get('/dateRange', ()=>{})


// Get Order details
router.get('/:id', orderController.getOrderDetails)

// Get Order status
router.get('/:id/status', ()=>{})

/********************
 * POST routes
********************/

// Create Order
router.post('/createOrder', orderController.createOrder)


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