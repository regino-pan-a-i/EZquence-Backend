/***********************************
 * Require Statements
************************************/ 
const supabase = require('../database/connect')

const productModel = {}

/*
*   Product schema:
* product{
*   productId,		
*   name
*   price
*   details
*   companyId
*  }
*/


productModel.getProductListByCompanyId = async (companyId) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

productModel.getProductDetails = async (id) =>{
    try {
        let { data, error } = await supabase
        .from('product')
        .select('*')
        .eq('productId', id)
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

productModel.getProductName = async (id) =>{
    try {
        let { data, error } = await supabase
        .from('product')
        .select('name')
        .eq('productId', id)
        if (error) throw error;
        return data[0];
    } catch (error) {
        throw error;
    }
}

productModel.createProduct = async (productData) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .insert([{
                name: productData.name,
                price: productData.price,
                details: productData.details,
                companyId: productData.companyId
            }])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

productModel.updateProduct = async (id, updateData) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .update(updateData)
            .eq('productId', id)
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }
}

productModel.deleteProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .delete()
            .eq('productId', id);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

productModel.searchProducts = async (query) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*')
            .or(`name.ilike.%${query}%,details.ilike.%${query}%`);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

productModel.getProductsByCategory = async (companyId) => {
    try {
        const { data, error } = await supabase
            .from('product')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}


module.exports = productModel;