/***********************************
 * Require Statements
 ************************************/
const cartModel = require('../models/cart');

const cartController = {};

/***********************************
 * Cart Operations
 ************************************/

/**
 * Get or create active cart for user
 */
cartController.getOrCreateCart = async (req, res) => {
  try {
    const userId = req.user.usr_id;
    const companyId = req.user.user_company;
    // Try to get existing active cart
    let cart = await cartModel.getCartByUserId(userId);

    // If no active cart exists, create one
    if (!cart || cart.length == 0) {
      cart = await cartModel.createCart({
        userId: userId,
        companyId: companyId,
        cartStatus: 'PENDING',
      });
    }
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get cart details with all items (includes product names and prices)
 */
cartController.getCartDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    let cart = await cartModel.getCartById(id);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          cart: null,
          items: [],
        },
      });
    }
    // Get cart details with items
    let items = await cartModel.getCartItems(cart.cartId);

    res.status(200).json({
      success: true,
      data: {
        cart: cart,
        items: items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get current user's cart with items
 */
cartController.getMyCart = async (req, res) => {
  try {
    const userId = req.user.usr_id;

    // Get active cart
    let cart = await cartModel.getCartByUserId(userId);

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          cart: null,
          items: [],
        },
      });
    }
    // Get cart details with items
    let items = await cartModel.getCartItems(cart.cartId);

    res.status(200).json({
      success: true,
      data: {
        cart: cart,
        items: items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update cart information (notes, status)
 */
cartController.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    let data = await cartModel.updateCart(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete cart
 */
cartController.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    await cartModel.deleteCart(id);

    res.status(200).json({
      success: true,
      message: 'Cart deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update cart status (PENDING, COMPLETED, CANCELLED)
 */
cartController.updateCartStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    // Validate status
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be PENDING, COMPLETED, or CANCELLED',
      });
    }

    let data = await cartModel.updateCartStatus(id, status);

    res.status(200).json({
      success: true,
      message: 'Cart status updated successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/***********************************
 * Cart Item Operations
 ************************************/

/**
 * Add item to cart
 */
cartController.addCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    const companyId = req.user.user_company;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and quantity are required',
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      });
    }

    let data = await cartModel.addCartItem({
      cartId: id,
      productId: productId,
      quantity: quantity,
      companyId: companyId,
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update cart item quantity
 */
cartController.updateCartItem = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { quantity } = req.body;

    if (!id || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID and Product ID are required',
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        error: 'Quantity is required',
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity cannot be negative',
      });
    }

    let data = await cartModel.updateCartItemQuantity(id, productId, quantity);

    if (quantity === 0) {
      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Remove item from cart
 */
cartController.removeCartItem = async (req, res) => {
  try {
    const { id, productId } = req.params;

    if (!id || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID and Product ID are required',
      });
    }

    await cartModel.removeCartItem(id, productId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Clear all items from cart
 */
cartController.clearCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    await cartModel.clearCart(id);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get cart item count
 */
cartController.getCartItemCount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    let count = await cartModel.getCartItemCount(id);

    res.status(200).json({
      success: true,
      data: {
        itemCount: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = cartController;
