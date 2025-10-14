/***********************************
 * Require Statements
************************************/ 
const supabase = require('../database/connect')
const productModel = require('./product')

const orderModel = {}

/*
*   Order schema
*
* order{
*   orderId,
*   orderTotal,
*   dateCreated,
*   status,
*   paid,
*   notes,
*   userId,
*   dateDelivered,
*   companyId
* }
* 
* orderProductList{
*   orderId,
*   productId,
*   quantity,
*   unitPrice,
*   total,
*   companyId
* }
*/



orderModel.getOrderlListByCompanyId = async (companyId) => {
    try {
        const { data, error } = await supabase
            .from('order')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

orderModel.getOrderListByDateRange = async (startDate, endDate) =>{

    // Dates must be in format YYY-MM-DD

    // Filter by date range using greater than/equal and less than/equal
    const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate)  
    .lte('created_at', endDate); 
}

orderModel.getOrderDetails = async (id) =>{
    try {
        let { data, error } = await supabase
        .from('order')
        .select('*')
        .eq('orderId', id)
        if (error) throw error;
        
        let products =  await orderModel.getOrderProductList(id)
        
        let order = {
            "order": data,
            "products" : products
        }
        return order;
    } catch (error) {
        throw error;
    }
}

orderModel.getOrderProductList = async (id) => {
    try {
        let { data, error } = await supabase
        .from('orderProductList')
        .select('*')
        .eq('orderId', id)
        if (error) throw error;
        
        let products = []
        for (const product of data ){
            let prodcutId = product['productId']
            
            product['productName'] = await productModel.getProductName(prodcutId)
            products.push(product)
        }

        return products;
    } catch (error) {
        throw error;
    } 
}

orderModel.createOrder = async (orderData) => {
    try {
        const { data, error } = await supabase
            .from('order')
            .insert([{
                orderTotal: orderData.orderTotal,
                dateCreated: orderData.dateCreated,
                status: orderData.status,
                paid: orderData.paid,
                notes: orderData.notes,
                userId: orderData.userId,
                dateDelivered: orderData.dateDelivered,
                companyId: orderData.companyId
            }])
            .select();

        console.log(data)
        // for (product of orderData.productList){

        //     orderModel.createProductList(product)
        // }

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

orderModel.updateOrder = async (id, updateData) => {
    try {
        const { data, error } = await supabase
            .from('order')
            .update(updateData)
            .eq('orderId', id)
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }
}

orderModel.deleteOrder = async (id) => {
    try {
        const { data, error } = await supabase
            .from('order')
            .delete()
            .eq('orderId', id);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

orderModel.createProductList = async (productList) =>{
    try {

        const { data, error } = await supabase
            .from('order')
            .insert([{
                orderTotal: orderData.orderTotal,
                productId: orderData.productId,
                quantity: orderData.quantity,
                unitPrice: orderData.unitPrice,
                total: orderData.total,
                companyId: orderData.companyId
            }])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}




module.exports = orderModel;