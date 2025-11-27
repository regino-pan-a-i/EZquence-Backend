/***********************************
 * Require Statements
 ************************************/
const materialModel = require('../models/material');
const inventoryModel = require('../models/inventory');

const inventoryController = {};

/**
 * Get all materials (inventory) for the company
 */
inventoryController.getMaterialList = async (req, res, next) => {
  try {
    const companyId = req.user.user_company;
    let data = await materialModel.getMaterialListByCompanyId(companyId);
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

/**
 * Get details of a specific material
 */
inventoryController.getMaterialDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    let data = await materialModel.getMaterialDetails(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
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
 * Create a new material in inventory
 */
inventoryController.createMaterial = async (req, res, next) => {
  try {
    const materialData = req.body;
    const companyId = req.user.user_company;

    // Add companyId to material data
    materialData.companyId = companyId;
    // Basic validation
    if (!materialData.name || materialData.quantityInStock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Material name and quantity in stock are required',
      });
    }

    let data = await materialModel.createMaterial(materialData);
    res.status(201).json({
      success: true,
      message: 'Material created successfully',
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
 * Update an existing material in inventory
 */
inventoryController.updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    let data = await materialModel.updateMaterial(id, updateData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
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
 * Delete a material from inventory
 */
inventoryController.deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    let data = await materialModel.deleteMaterial(id);

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Search materials in inventory
 */
inventoryController.searchMaterials = async (req, res, next) => {
  try {
    const { query } = req.query;
    const companyId = req.user.user_company;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    let data = await materialModel.searchMaterials(query);

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

/**
 * Adjust material quantity (for inventory adjustments)
 */
inventoryController.adjustMaterialQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body;
    const companyId = req.user.user_company;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    if (adjustment === undefined || adjustment === null) {
      return res.status(400).json({
        success: false,
        error: 'Adjustment value is required',
      });
    }

    // Get current material details
    let material = await materialModel.getMaterialDetails(id);

    if (!material || material.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    // Calculate new quantity
    const currentQuantity = material[0].quantityInStock || 0;
    const newQuantity = currentQuantity + adjustment;

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Adjustment would result in negative inventory',
      });
    }

    // Update the material with new quantity
    let data = await materialModel.updateMaterial(id, {
      quantityInStock: newQuantity,
    });

    res.status(200).json({
      success: true,
      message: 'Material quantity adjusted successfully',
      data: {
        ...data[0],
        previousQuantity: currentQuantity,
        adjustment: adjustment,
        reason: reason || 'Manual adjustment',
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
 * Get daily material needs based on today's orders
 */
inventoryController.getDailyMaterialNeeds = async (req, res, next) => {
  try {
    let data = await materialModel.getDailyMaterialNeeds();

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

/**
 * Get all processes that use a specific material
 */
inventoryController.getProcessesByMaterialId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    let data = await materialModel.getProcessesByMaterialId(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

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

/********************
 * Inventory Transaction CRUD Operations
 ********************/

/**
 * Get all inventory transactions for the company
 */
inventoryController.getTransactionList = async (req, res, next) => {
  try {
    const companyId = req.user.user_company;
    let data = await inventoryModel.getTransactionsByCompanyId(companyId);
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

/**
 * Get details of a specific inventory transaction
 */
inventoryController.getTransactionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required',
      });
    }

    let data = await inventoryModel.getTransactionById(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
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
 * Get inventory transactions by product ID
 */
inventoryController.getTransactionsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await inventoryModel.getTransactionsByProductId(productId);

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

/**
 * Create a new inventory transaction
 */
inventoryController.createTransaction = async (req, res, next) => {
  try {
    const transactionData = req.body;
    const companyId = req.user.user_company;

    // Add companyId to transaction data
    transactionData.companyId = companyId;

    // Basic validation
    if (!transactionData.quantity || !transactionData.productId) {
      return res.status(400).json({
        success: false,
        error: 'Quantity and product ID are required',
      });
    }

    let data = await inventoryModel.createTransaction(transactionData);
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
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
 * Update an existing inventory transaction
 */
inventoryController.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required',
      });
    }

    let data = await inventoryModel.updateTransaction(id, updateData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
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
 * Delete an inventory transaction
 */
inventoryController.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required',
      });
    }

    let data = await inventoryModel.deleteTransaction(id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
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
 * Get current stock for a product
 */
inventoryController.getProductStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { date } = req.query; // Optional query parameter for specific date

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await inventoryModel.getProductStock(productId, date);

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

module.exports = inventoryController;
