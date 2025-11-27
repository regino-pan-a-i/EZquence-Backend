/***********************************
 * Require Statements
 ************************************/
const processModel = require('../models/process');
const materialModel = require('../models/material');

const processController = {};

/********************
 * GET Operations
 ********************/

// Get all processes for a company
processController.getProcessList = async (req, res, next) => {
  try {
    const companyId = req.user.user_company;

    let data = await processModel.getProcessListByCompanyId(companyId);

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

// Get process Materials by process ID
processController.getProcessMaterials = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await materialModel.getMaterialsByProcessId(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
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

/********************
 * POST Operations
 ********************/

// Create a new process
processController.createProcess = async (req, res, next) => {
  try {
    const companyId = req.user.user_company;
    const processData = {
      ...req.body,
      companyId: companyId,
    };

    if (!processData.productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    if (!processData.name) {
      return res.status(400).json({
        success: false,
        error: 'Process name is required',
      });
    }

    let data = await processModel.createProcess(processData);
    console.log(data);
    res.status(201).json({
      success: true,
      message: 'Process created successfully',
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

// Add new material to the process' material list
processController.addMaterialToMaterialList = async (req, res, next) => {
  try {
    const newMaterial = req.body;
    const companyId = req.user.user_company;

    newMaterial.companyId = companyId;

    let data = await materialModel.addMaterialToMaterialList(newMaterial);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Process updated successfully',
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

/********************
 * PUT Operations
 ********************/

// Update a process
processController.updateProcess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const processData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await processModel.updateProcess(id, processData);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Process updated successfully',
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

// Update process materials
processController.updateProcessMaterial = async (req, res, next) => {
  try {
    const { processId, materialId } = req.params;
    const editedMaterial = req.body;

    let data = await materialModel.updateMaterialListByMaterialId(
      processId,
      materialId,
      editedMaterial
    );

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Process updated successfully',
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

/********************
 * DELETE Operations
 ********************/

// Delete a process
processController.deleteProcess = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required',
      });
    }

    let data = await processModel.deleteProcess(id);

    res.status(200).json({
      success: true,
      message: 'Process deleted successfully',
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

// Delete Mateiral from material list
processController.deleteMaterialFromMaterialList = async (req, res, next) => {
  try {
    const { processId, materialId } = req.params;

    if (!processId) {
      return res.status(400).json({
        success: false,
        error: 'Process ID is required',
      });
    }

    if (!materialId) {
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    let data = await materialModel.deleteMaterialFromMaterialList(
      processId,
      materialId
    );

    res.status(200).json({
      success: true,
      message: 'Process deleted successfully',
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

module.exports = processController;
