/***********************************
 * Require Statements
 ************************************/
const orderModel = require('../models/order');

const orderController = {};

orderController.getDailyOrderList = async (req, res, next) => {
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

orderController.getOrderListByDateRange = async (req, res, next) => {
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

orderController.getOrderDetails = async (req, res, next) => {
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

orderController.createOrder = async (req, res, next) => {
  try {
    const companyId = req.user.user_company;
    const orderData = req.body;
    let data = await orderModel.createOrder(orderData);
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

module.exports = orderController;
