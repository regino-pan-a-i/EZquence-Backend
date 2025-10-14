/***********************************
 * Require Statements
************************************/
const orderModel = require('../models/order')



const orderController = {};

orderController.getOrderDetails = async (req, res, next) => {
    try {
        const { id } = req.params
        const { companyId } = 1
        let data = await orderModel.getOrderDetails(id);
        res.status(200).json({
            success: true,
            data: data
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

orderController.createOrder = async (req, res, next) =>{
    try {
        const { companyId } = 1
        const orderData = req.body
        console.log(orderData)
        let data = await orderModel.createOrder(orderData);
        res.status(200).json({
            success: true,
            data: data
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = orderController