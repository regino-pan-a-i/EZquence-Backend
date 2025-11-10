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

/*
*   Material List schema
* materialList{
*   processId,
*   materialId,
*   quantity,
*   units,
*   companyId
* }
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

materialModel.getMaterialsByProcessId = async (companyId) => {
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


materialModel.getMaterialsByMaterialList = async (processId) =>{
    try {
        const { data, error } = await supabase
            .from('materialList')
            .select(`
                processId,
                materialId,
                quantityNeeded,
                unitsNeeded,
                material:materialId (
                    materialId,
                    name,
                    quantityInStock,
                    units,
                    companyId,
                    expirationDate
                )
            `)
            .eq('processId', processId);
        
        if (error) throw error;
        
        // Flatten the structure to merge material details with materialList data
        const flattenedData = data.map(item => ({
            processId: item.processId,
            materialId: item.materialId,
            quantityNeeded: item.quantityNeeded,
            units: item.unitsNeeded,
            name: item.material?.name,
            quantityInStock: item.material?.quantityInStock,
            materialUnits: item.material?.units,
            companyId: item.material?.companyId
        }));
        
        return flattenedData;
    } catch (error) {
        throw error;
    }
}

module.exports = materialModel;