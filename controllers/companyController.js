/***********************************
 * Require Statements
 ************************************/
const companyModel = require('../models/company');

const companyController = {};

/***********************************
 * Company Controllers
 ************************************/

// Get company by ID
companyController.getCompanyById = async (req, res, _next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    let data = await companyModel.getCompanyById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
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

// Get all companies
companyController.getAllCompanies = async (req, res, _next) => {
  try {
    let data = await companyModel.getAllCompanies();

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

// Create a new company
companyController.createCompany = async (req, res, _next) => {
  try {
    const companyData = req.body;

    // Basic validation
    if (!companyData.name) {
      return res.status(400).json({
        success: false,
        error: 'Company name is required',
      });
    }

    let data = await companyModel.createCompany(companyData);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update company
companyController.updateCompany = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    let data = await companyModel.updateCompany(id, updateData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete company
companyController.deleteCompany = async (req, res, _next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    await companyModel.deleteCompany(id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Search companies
companyController.searchCompanies = async (req, res, _next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    let data = await companyModel.searchCompanies(query);

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

/***********************************
 * Production Goals Controllers
 ************************************/

// Get production goal by ID
companyController.getProductionGoalById = async (req, res, _next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Production goal ID is required',
      });
    }

    let data = await companyModel.getProductionGoalById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Production goal not found',
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

// Get all production goals for a company
companyController.getProductionGoalsByCompanyId = async (req, res, _next) => {
  try {
    const companyId = req.user?.user_company || req.params.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    let data = await companyModel.getProductionGoalsByCompanyId(companyId);

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

// Get all production goals for a product
companyController.getProductionGoalsByProductId = async (req, res, _next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await companyModel.getProductionGoalsByProductId(productId);

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

// Get active production goals
companyController.getActiveProductionGoals = async (req, res, _next) => {
  try {
    const companyId = req.user?.user_company || req.params.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    let data = await companyModel.getActiveProductionGoals(companyId);

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

// Create a new production goal
companyController.createProductionGoal = async (req, res, _next) => {
  try {
    const goalData = req.body;
    const companyId = req.user?.user_company;

    // Add companyId from user if not provided in body
    if (companyId && !goalData.companyId) {
      goalData.companyId = companyId;
    }

    // Basic validation
    if (!goalData.goalValue || !goalData.productId || !goalData.companyId) {
      return res.status(400).json({
        success: false,
        error: 'Goal value, product ID, and company ID are required',
      });
    }

    let data = await companyModel.createProductionGoal(goalData);

    res.status(201).json({
      success: true,
      message: 'Production goal created successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update production goal
companyController.updateProductionGoal = async (req, res, _next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Production goal ID is required',
      });
    }

    let data = await companyModel.updateProductionGoal(id, updateData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Production goal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Production goal updated successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete production goal
companyController.deleteProductionGoal = async (req, res, _next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Production goal ID is required',
      });
    }

    await companyModel.deleteProductionGoal(id);

    res.status(200).json({
      success: true,
      message: 'Production goal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get production goals by date range
companyController.getProductionGoalsByDateRange = async (req, res, _next) => {
  try {
    const companyId = req.user?.user_company || req.params.companyId;
    const { startDate, endDate } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required',
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required',
      });
    }

    let data = await companyModel.getProductionGoalsByDateRange(
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

module.exports = companyController;
