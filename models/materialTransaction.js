/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');
const materialModel = require('./material');

const materialTransactionModel = {};

/*
 *  Material Transaction schema
 * materialTransaction{
 *  materialTransactionId,
 *  materialId,
 *  companyId,
 *  cost,
 *  dateCreated,
 *  quantity,
 *  units
 * }
 */

/**
 * Create a new material transaction and update material stock
 * @param {Object} transactionData - { materialId, companyId, cost, quantity, units }
 * @returns {Promise<Object>} Created transaction
 */
materialTransactionModel.create = async transactionData => {
  // First, insert the transaction
  const { data: transactionResult, error: transactionError } = await supabase
    .from('materialTransaction')
    .insert([
      {
        materialId: transactionData.materialId,
        companyId: transactionData.companyId,
        cost: transactionData.cost,
        quantity: transactionData.quantity,
        units: transactionData.units,
      },
    ])
    .select();

  if (transactionError) throw transactionError;

  // Then, update the material's quantityInStock
  // Get current material details
  const materialDetails = await materialModel.getMaterialDetails(
    transactionData.materialId
  );

  if (!materialDetails || materialDetails.length === 0) {
    throw new Error('Material not found');
  }

  const currentQuantity = materialDetails[0].quantityInStock || 0;
  const newQuantity = currentQuantity + transactionData.quantity;

  // Update the material quantity
  await materialModel.updateMaterial(transactionData.materialId, {
    quantityInStock: newQuantity,
  });

  return transactionResult;
};

/**
 * Get all material transactions for a company with material details
 * @param {string} companyId - Company ID
 * @returns {Promise<Array>} List of transactions with joined material data
 */
materialTransactionModel.getListByCompanyId = async companyId => {
  const { data, error } = await supabase
    .from('materialTransaction')
    .select(
      `
      materialTransactionId,
      materialId,
      companyId,
      cost,
      dateCreated,
      quantity,
      units,
      material:materialId (
        materialId,
        name,
        quantityInStock,
        units
      )
    `
    )
    .eq('companyId', companyId)
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Get material transactions by date range with material details
 * @param {string} companyId - Company ID
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise<Array>} Filtered transactions with joined material data
 */
materialTransactionModel.getByDateRange = async (
  companyId,
  startDate,
  endDate
) => {
  const { data, error } = await supabase
    .from('materialTransaction')
    .select(
      `
      materialTransactionId,
      materialId,
      companyId,
      cost,
      dateCreated,
      quantity,
      units,
      material:materialId (
        materialId,
        name,
        quantityInStock,
        units
      )
    `
    )
    .eq('companyId', companyId)
    .gte('dateCreated', startDate)
    .lte('dateCreated', endDate)
    .order('dateCreated', { ascending: false });
  if (error) throw error;
  return data;
};

module.exports = materialTransactionModel;
