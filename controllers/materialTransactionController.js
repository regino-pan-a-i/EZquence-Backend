/***********************************
 * Require Statements
 ************************************/
const materialTransactionModel = require('../models/materialTransaction');
const materialModel = require('../models/material');

const materialTransactionController = {};

/**
 * Create a new material transaction
 * Validates materialId exists, then creates transaction and updates material stock
 */
materialTransactionController.createMaterialTransaction = async (req, res) => {
  try {
    const { materialId, cost, quantity, units } = req.body;
    const companyId = req.user.user_company;

    // Validate required fields
    if (!materialId || cost === undefined || !quantity || !units) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: materialId, cost, quantity, and units are required',
      });
    }

    // Validate quantity is positive
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be greater than 0',
      });
    }

    // Validate cost is non-negative
    if (cost < 0) {
      return res.status(400).json({
        success: false,
        error: 'Cost cannot be negative',
      });
    }

    // Verify material exists and belongs to the company
    const materialDetails = await materialModel.getMaterialDetails(materialId);

    if (!materialDetails || materialDetails.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    if (materialDetails[0].companyId !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Material does not belong to your company',
      });
    }

    // Create transaction (this will also update material stock)
    const transactionData = {
      materialId,
      companyId,
      cost,
      quantity,
      units,
    };

    const result = await materialTransactionModel.create(transactionData);

    return res.status(201).json({
      success: true,
      message: 'Material transaction created successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error creating material transaction:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get all material transactions for the company
 * Returns transactions with joined material details
 */
materialTransactionController.getAllMaterialTransactions = async (req, res) => {
  try {
    const companyId = req.user.user_company;

    const transactions =
      await materialTransactionModel.getListByCompanyId(companyId);

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching material transactions:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get material transactions by date range
 * Query params: startDate, endDate (ISO format)
 * Returns filtered transactions with joined material details
 */
materialTransactionController.getMaterialTransactionsByDateRange = async (
  req,
  res
) => {
  try {
    const companyId = req.user.user_company;
    const { startDate, endDate } = req.query;

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Both startDate and endDate query parameters are required',
      });
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    console.log(end)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        error: 'startDate cannot be after endDate',
      });
    }

    const transactions = await materialTransactionModel.getByDateRange(
      companyId,
      startDate,
      end.toISOString()
    );
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching material transactions by date range:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = materialTransactionController;
