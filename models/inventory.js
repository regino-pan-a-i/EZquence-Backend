/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');
const productModel = require('./product');

const inventoryModel = {};

/*
 *   InventoryTransaction schema
 *
 *
 * inventoryTransaction{
 *   transactionId,
 *   quantity,
 *   dateCreated,
 *   productId,
 *   companyId,
 *   reason
 * }
 *
 *
 */

/**
 * Get all inventory transactions for a company
 */
inventoryModel.getTransactionsByCompanyId = async companyId => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .select('*')
    .eq('companyId', companyId)
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get a specific inventory transaction by ID
 */
inventoryModel.getTransactionById = async transactionId => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .select('*')
    .eq('transactionId', transactionId);

  if (error) throw error;
  return data;
};

/**
 * Get inventory transactions by product ID
 */
inventoryModel.getTransactionsByProductId = async productId => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .select('*')
    .eq('productId', productId)
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Create a new inventory transaction
 */
inventoryModel.createTransaction = async transactionData => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .insert([
      {
        quantity: transactionData.quantity,
        productId: transactionData.productId,
        companyId: transactionData.companyId,
        reason: transactionData.reason,
        dateCreated: transactionData.dateCreated || new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

/**
 * Update an inventory transaction
 */
inventoryModel.updateTransaction = async (transactionId, updateData) => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .update(updateData)
    .eq('transactionId', transactionId)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Delete an inventory transaction
 */
inventoryModel.deleteTransaction = async transactionId => {
  const { data, error } = await supabase
    .from('inventoryTransaction')
    .delete()
    .eq('transactionId', transactionId);

  if (error) throw error;
  return data;
};

/**
 * Get current stock for a product by summing all transactions
 */
inventoryModel.getProductStock = async (productId, date = null) => {
  let query = supabase
    .from('inventoryTransaction')
    .select('quantity, product(productId, name)')
    .eq('productId', productId);

  // If date is provided, filter by that date
  if (date) {
    query = query.eq('dateCreated', date);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Calculate the sum of all quantities
  const totalStock = data.reduce(
    (sum, transaction) => sum + transaction.quantity,
    0
  );

  // Get product info from first transaction (all have same product)
  let productInfo;
  if (data.length > 0 && data[0].product) {
    productInfo = {
      productId: data[0].product.productId,
      productName: data[0].product.name,
    };
  } else {
    // No transactions exist, query product directly
    const productData = await productModel.getProductDetails(productId);
    productInfo = {
      productId,
      productName:
        productData && productData.length > 0 ? productData[0].name : null,
    };
  }

  return {
    ...productInfo,
    totalStock,
    transactionCount: data.length,
  };
};

module.exports = inventoryModel;
