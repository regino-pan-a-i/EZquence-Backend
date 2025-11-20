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
        if (!companyId) {
            throw new Error('companyId is required');
        }
        
        const { data, error } = await supabase
            .from('product')
            .select('*, productImage ( productId, imageURL )')
            .eq('companyId', BigInt(companyId));
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }        
        
        return data;
    } catch (error) {
        console.error('Product list error:', error);
        throw error;
    }
}

productModel.getProductDetails = async (id) =>{
    try {
        let { data, error } = await supabase
        .from('product')
        .select('*, productImage ( productId, imageURL )')        
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
        if (!productData.companyId) {
            throw new Error('companyId is required');
        }
        
        const { data, error } = await supabase
            .from('product')
            .insert([{
                name: productData.name,
                price: productData.price,
                details: productData.details,
                companyId: BigInt(productData.companyId)
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

productModel.updateImage = async (id, imageData) => {
        try {
        const { data, error } = await supabase
            .from('productImage')
            .update(imageData)
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
        if (!companyId) {
            throw new Error('companyId is required');
        }
        
        const { data, error } = await supabase
            .from('product')
            .select('*')
            .eq('companyId', BigInt(companyId));
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}


module.exports = productModel;