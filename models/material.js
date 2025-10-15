/***********************************
 * Require Statements
************************************/ 
const supabase = require('../database/connect')

const materialModel = {}

/*
*   Material schema:
* material{
*   materialId,		
*   name
*   quantityInStock
*   units
*   companyId
*  }
*/


materialModel.getMaterialListByCompanyId = async (companyId) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.getMaterialDetails = async (id) =>{
    try {
        let { data, error } = await supabase
        .from('material')
        .select('*')
        .eq('materialId', id)
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.createMaterial = async (materialData) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .insert([{
                name: materialData.name,
                quantityInStock: materialData.quantityInStock,
                units: materialData.units,
                companyId: materialData.companyId
            }])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.updateMaterial = async (id, updateData) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .update(updateData)
            .eq('materialId', id)
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }
}

materialModel.deleteMaterial = async (id) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .delete()
            .eq('materialId', id);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.searchMaterials = async (query) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .select('*')
            .or(`name.ilike.%${query}%,details.ilike.%${query}%`);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.getMaterialsByCategory = async (companyId) => {
    try {
        const { data, error } = await supabase
            .from('material')
            .select('*')
            .eq('companyId', companyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}


module.exports = materialModel;