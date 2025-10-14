/***********************************
 * Require Statements
************************************/ 
const supabase = require('../database/connect')

const processModel = {}

/*
*   Process schema:
* product{
*   processId,		
*   productId,		
*   name
*   details
*   ProductsPerBatch
*   companyId
*  }
*/

processModel.getProcessListByCompanyId = async (companyId) =>{
    try {
        const { data, error } = await supabase
            .from('process')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

processModel.getProcessByProductId = async (productId) =>{
    try {
        const { data, error } = await supabase
            .from('process')
            .select('*')
            .eq('productId', productId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

processModel.createProcess = async (processData) => {
    try {
        const { data, error } = await supabase
            .from('process')
            .insert([{
                name: processData.name,
                details: processData.details,
                productsPerBatch: processData.productsPerBatch,
                productId: processData.productId,
                companyId: processData.companyId
            }])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

processModel.updateProcess = async (id, processData) => {
    try {
        const { data, error } = await supabase
            .from('process')
            .update(processData)
            .eq('productId', id)
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }
}

processModel.deleteProcess = async (id) => {
    try {
        const { data, error } = await supabase
            .from('process')
            .delete()
            .eq('productId', id);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

module.exports = processModel;