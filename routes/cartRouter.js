const express = require('express');
const router = express.Router();
const util = require('../utils/index');

// Import Controllers
const cartController = require('../controllers/cartController');

/********************
 * Cart Routes
 ********************/

/**
 * GET /cart
 * Get or create active cart for current user
 */
router.get('/', util.verifyUser, cartController.getOrCreateCart);

/**
 * GET /cart/my-cart
 * Get current user's cart with all items (includes product names and prices)
 */
router.get('/my-cart', util.verifyUser, cartController.getMyCart);

/**
 * GET /cart/:id
 * Get cart details by cart ID
 */
router.get('/:id', util.verifyUser, cartController.getCartDetails);

/**
 * GET /cart/:id/count
 * Get total item count in cart
 */
router.get('/:id/count', util.verifyUser, cartController.getCartItemCount);

/**
 * PUT /cart/:id
 * Update cart information (notes, etc.)
 */
router.put('/:id', util.verifyUser, cartController.updateCart);

/**
 * PUT /cart/:id/status
 * Update cart status (PENDING, COMPLETED, CANCELLED)
 */
router.put('/:id/status', util.verifyUser, cartController.updateCartStatus);

/**
 * DELETE /cart/:id
 * Delete cart
 */
router.delete('/:id', util.verifyUser, cartController.deleteCart);

/********************
 * Cart Item Routes
 ********************/

/**
 * POST /cart/:id/items
 * Add item to cart
 */
router.post('/:id/items', util.verifyUser, cartController.addCartItem);

/**
 * PUT /cart/:id/items/:productId
 * Update cart item quantity
 */
router.put(
  '/:id/items/:productId',
  util.verifyUser,
  cartController.updateCartItem
);

/**
 * DELETE /cart/:id/items/:productId
 * Remove item from cart
 */
router.delete(
  '/:id/items/:productId',
  util.verifyUser,
  cartController.removeCartItem
);

/**
 * DELETE /cart/:id/items
 * Clear all items from cart
 */
router.delete('/:id/items', util.verifyUser, cartController.clearCart);

module.exports = router;
