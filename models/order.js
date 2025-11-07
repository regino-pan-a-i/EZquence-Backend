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

orderModel.getOrderListByDateRange = async (startDate, endDate = new Date().toISOString()) =>{

    try{

        const { data, error } = await supabase
            .from('order')
            .select('*')
            .gte('dateCreated', startDate)  
            .lt('dateCreated', endDate)
            .order('dateCreated', { ascending: true });
        return data
    } catch (error) {
        throw error;
    }
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

        for (let product of orderData.productList){
            product['orderId'] = data[0]['orderId']
            orderModel.createProductList(product)
        }

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

orderModel.createProductList = async (productData) =>{
    try {

        const { data, error } = await supabase
            .from('orderProductList')
            .insert([{
                orderId: productData.orderId,
                productId: productData.productId,
                quantity: productData.quantity,
                unitPrice: productData.unitPrice,
                total: productData.total,
                companyId: productData.companyId
            }])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}




module.exports = orderModel;