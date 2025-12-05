/***********************************
 * Require Statements
 ************************************/
const orderModel = require('../models/order');
const cartModel = require('../models/cart');

const orderController = {};

orderController.getDailyOrderList = async (req, res) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Set to 12 AM (midnight)
    const startDate = date.toISOString();
    const companyId = req.user.user_company;
    let data = await orderModel.getOrderListByDateRange(companyId, startDate);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

orderController.getOrderListByDateRange = async (req, res) => {
  try {
    const companyId = req.user.user_company;

    let startDate = req.query.start;
    let endDate = req.query.end;

    startDate = new Date(startDate);
    startDate.setHours(0, 0, 0, 0);
    startDate = startDate.toISOString();

    endDate = new Date(endDate);
    endDate.setHours(23, 59, 59, 999);
    endDate = endDate.toISOString();

    let data = await orderModel.getOrderListByDateRange(
      companyId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

orderController.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await orderModel.getOrderDetails(id);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

orderController.getOrdersByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID is required',
      });
    }

    let data = await orderModel.getOrdersByUserId(id);

    console.log(data)
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

orderController.createOrder = async (req, res) => {
  try {
    const userId = req.user.usr_id;
    const companyId = req.user.user_company;
    const { cartId, deliveryDate, notes } = req.body;

    // Validate required fields
    if (!cartId) {
      return res.status(400).json({
        success: false,
        error: 'Cart ID is required',
      });
    }

    let cart = await cartModel.getCartById(cartId);

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
    // Get cart details with items
    const cartDetails = {
      cart: cart,
      items: items,
    };

    if (!cartDetails || !cartDetails.cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    // Verify cart belongs to user and is PENDING
    if (cartDetails.cart.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized to access this cart',
      });
    }

    if (cartDetails.cart.cartStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'Cart is not in PENDING status',
      });
    }

    // Check if cart has items
    if (!cartDetails.items || cartDetails.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty',
      });
    }

    // Build product list and calculate order total
    let orderTotal = 0;
    const productList = cartDetails.items.map(item => {
      const price = item.product?.price || 0;
      const quantity = item.quantity;
      const total = price * quantity;
      orderTotal += total;

      return {
        productId: item.productId,
        quantity: quantity,
        unitPrice: price,
        total: total,
        companyId: companyId,
      };
    });

    // Create order object
    const orderData = {
      orderTotal: orderTotal,
      paid: false,
      notes: notes || cartDetails.cart.notes || null,
      userId: userId,
      expectedDeliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(),
      companyId: companyId,
      productList: productList,
    };

    // Create the order
    let data = await orderModel.createOrder(orderData);

    // Mark cart as COMPLETED
    await cartModel.updateCartStatus(cartId, 'COMPLETED');

    res.status(201).json({
      success: true,
      message: 'Order created successfully from cart',
      data: data,
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
 * Get order status
 */
orderController.getOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    let data = await orderModel.getOrderStatus(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update order details
 */
orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    let data = await orderModel.updateOrder(id, updateData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
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
 * Update order status
 */
orderController.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    let data = await orderModel.updateOrder(id, { status });

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
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
 * Delete order
 */
orderController.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required',
      });
    }

    let data = await orderModel.deleteOrder(id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = orderController;
