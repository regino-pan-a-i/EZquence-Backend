/***********************************
 * Require Statements
************************************/
const productModel = require('../models/product')
const processModel = require('../models/process')


const productController = {};


productController.getProductList = async (req, res, next) => {
    try {
        const companyId = req.user.user_company
        let data = await productModel.getProductListByCompanyId(companyId);
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

productController.getProcessList = async (req, res, next) => {
    try {
        const companyId = req.user.user_company
        let data = await productModel.getProcessListByCompanyId(companyId);
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

productController.getProductDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await productModel.getProductDetails(id);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            data: data[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

productController.getProductProcess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await processModel.getProcessByProductId(id);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Process not found'
            });
        }
        res.status(200).json({
            success: true,
            data: data[0]
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

productController.createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const companyId = req.user.user_company

        // Basic validation
        if (!productData.name || !productData.price) {
            return res.status(400).json({
                success: false,
                error: 'Product name and price are required'
            });
        }

        let data = await productModel.createProduct(productData);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
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

productController.createProcess = async (req, res, next) => {
    try {
        const processData = req.body;
        const companyId = req.user.user_company

        // Basic validation
        if (!processData.name || !processData.details) {
            return res.status(400).json({
                success: false,
                error: 'Process name and description are required'
            });
        }

        let data = await processModel.createProcess(processData);
        
        res.status(201).json({
            success: true,
            message: 'Process created successfully',
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

productController.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await productModel.updateProduct(id, updateData);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
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

productController.updateProcess = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await processModel.updateProcess(id, updateData);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Process not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Process updated successfully',
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

productController.deleteProcessByProductId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await processModel.deleteProcess(id);
        
        res.status(200).json({
            success: true,
            message: 'Process deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
productController.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.user_company

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }

        let data = await productModel.deleteProduct(id);
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

productController.searchProducts = async (req, res, next) => {
    try {
        const { query } = req.query;
        const companyId = req.user.user_company

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        let data = await productModel.searchProducts(query);
        
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

module.exports = productController;