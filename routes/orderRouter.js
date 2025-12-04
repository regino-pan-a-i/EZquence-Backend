const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Error Handler
const utilHandler = require('../utils/index');

// Import Controllers
const orderController = require('../controllers/orderController');

/********************
 * GET routes
 ********************/

// Get today's Order list
router.get('/', util.verifyUser, (req, res) => {
  res.send({ message: 'Welcome to the Order Router' });
});

// Get today's Order list
router.get(
  '/today',
  util.verifyUser,
  util.verifyWorker,
  orderController.getDailyOrderList
);

// Get Order list by date range
router.get(
  '/dateRange',
  util.verifyUser,
  util.verifyWorker,
  orderController.getOrderListByDateRange
);

// Get Order details
router.get(
  '/:id',
  util.verifyUser,
  util.verifyWorker,
  orderController.getOrderDetails
);

// Get Order status
router.get(
  '/:id/status',
  util.verifyUser,
  util.verifyWorker,
  orderController.getOrderStatus
);

/********************
 * POST routes
 ********************/

// Create Order
router.post('/createOrder', util.verifyUser, orderController.createOrder);

/********************
 * PUT routes
 ********************/

// Update Order details
router.put(
  '/:id',
  util.verifyUser,
  util.verifyWorker,
  orderController.updateOrder
);

// Update Order status
router.put(
  '/:id/status',
  util.verifyUser,
  util.verifyWorker,
  orderController.updateOrderStatus
);

/********************
 * DELETE routes
 ********************/

// Delete Order by id
router.delete(
  '/:id/delete',
  util.verifyUser,
  util.verifyWorker,
  orderController.deleteOrder
);

module.exports = router;
