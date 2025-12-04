/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');
const productModel = require('./product');

const orderModel = {};

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

orderModel.getOrderlListByCompanyId = async companyId => {
  const { data, error } = await supabase
    .from('order')
    .select('*')
    .eq('companyId', companyId);

  if (error) throw error;
  return data;
};

orderModel.getOrderListByDateRange = async (
  companyId,
  startDate,
  endDate = new Date().toISOString()
) => {
  const { data, error } = await supabase
    .from('order')
    .select('*')
    .eq('companyId', companyId)
    .gte('dateCreated', startDate)
    .lt('dateCreated', endDate)
    .order('dateCreated', { ascending: true });
  if (error) throw error;
  return data;
};

orderModel.getOrderDetails = async id => {
  let { data, error } = await supabase
    .from('order')
    .select('*')
    .eq('orderId', id);
  if (error) throw error;

  let products = await orderModel.getOrderProductList(id);

  let order = {
    order: data[0],
    products: products,
  };
  return order;
};

orderModel.getOrderProductList = async id => {
  let { data, error } = await supabase
    .from('orderProductList')
    .select('*')
    .eq('orderId', id);
  if (error) throw error;

  let products = [];
  for (const product of data) {
    let prodcutId = product['productId'];

    product['productName'] = await productModel.getProductName(prodcutId);
    products.push(product);
  }

  return products;
};

orderModel.createOrder = async orderData => {
  const { data, error } = await supabase
    .from('order')
    .insert([
      {
        orderTotal: orderData.orderTotal,
        paid: orderData.paid,
        notes: orderData.notes,
        userId: orderData.userId,
        expectedDeliveryDate: orderData.expectedDeliveryDate,
        companyId: orderData.companyId,
      },
    ])
    .select();
  console.log(error)
  for (let product of orderData.productList) {
    product['orderId'] = data[0]['orderId'];
    orderModel.createProductList(product);
  }

  if (error) throw error;
  return data;
};

orderModel.getOrderStatus = async id => {
  const { data, error } = await supabase
    .from('order')
    .select('status')
    .eq('orderId', id);

  if (error) throw error;
  return data;
};

orderModel.updateOrder = async (id, updateData) => {
  const { data, error } = await supabase
    .from('order')
    .update(updateData)
    .eq('orderId', id)
    .select();

  if (error) throw error;
  return data;
};

orderModel.deleteOrder = async id => {
  const { data, error } = await supabase
    .from('order')
    .delete()
    .eq('orderId', id);

  if (error) throw error;
  return data;
};

orderModel.createProductList = async productData => {
  const { data, error } = await supabase
    .from('orderProductList')
    .insert([
      {
        orderId: productData.orderId,
        productId: productData.productId,
        quantity: productData.quantity,
        unitPrice: productData.unitPrice,
        total: productData.total,
        companyId: productData.companyId,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

orderModel.getDailyProductNeeds = async () => {
  // Set up date range for today
  const date = new Date();
  date.setHours(0, 0, 0, 0); // Start of day
  const startDate = date.toISOString();

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // End of day
  const endDateISO = endDate.toISOString();

  // Get today's orders that are paid but not completed
  const { data: orders, error: ordersError } = await supabase
    .from('order')
    .select('orderId')
    .gte('dateCreated', startDate)
    .lt('dateCreated', endDateISO)
    .eq('paid', true)
    .neq('status', 'COMPLETED');

  if (ordersError) throw ordersError;

  // If no orders found, return empty array
  if (!orders || orders.length === 0) {
    return [];
  }

  // Extract order IDs
  const orderIds = orders.map(order => order.orderId);

  // Get all product list items for these orders with product details
  const { data: orderProducts, error: productsError } = await supabase
    .from('orderProductList')
    .select('productId, quantity, product(productId, name)')
    .in('orderId', orderIds);

  if (productsError) throw productsError;

  // If no products found, return empty array
  if (!orderProducts || orderProducts.length === 0) {
    return [];
  }

  // Aggregate quantities by product using reduce
  const productMap = orderProducts.reduce((acc, item) => {
    const productId = item.productId;
    const productName = item.product?.name || 'Unknown Product';
    const quantity = item.quantity || 0;

    if (acc[productId]) {
      acc[productId].quantityNeeded += quantity;
    } else {
      acc[productId] = {
        productId: productId,
        productName: productName,
        quantityNeeded: quantity,
      };
    }

    return acc;
  }, {});

  // Convert object to array
  const result = Object.values(productMap);

  return result;
};

module.exports = orderModel;
