/***********************************
 * Require Statements
************************************/ 
const supabase = require('../database/connect')
const orderModel = require('./order')

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
*   quantityNeeded,
*   unitsNeeded,
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

materialModel.getDailyMaterialNeeds = async () => {
    try {
        // Get today's product needs
        const productNeeds = await orderModel.getDailyProductNeeds();

        // If no products needed, return empty array
        if (!productNeeds || productNeeds.length === 0) {
            return [];
        }

        // Object to accumulate material needs
        const materialNeedsMap = {};

        // Process each product
        for (const product of productNeeds) {
            const productId = product.productId;
            const productQuantityNeeded = product.quantityNeeded;

            try {
                // Get the process for this product directly using Supabase
                const { data: processData, error: processError } = await supabase
                    .from('process')
                    .select('*')
                    .eq('productId', productId);
                
                if (processError) throw processError;
                
                // Skip if no process found
                if (!processData || processData.length === 0) {
                    continue;
                }

                const process = processData[0];
                const processId = process.processId;
                const productsPerBatch = process.productsPerBatch || 1;

                // Get materials for this process directly using Supabase
                const { data: materialsData, error: materialsError } = await supabase
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
                            companyId
                        )
                    `)
                    .eq('processId', processId);
                
                if (materialsError) throw materialsError;

                // Skip if no materials defined
                if (!materialsData || materialsData.length === 0) {
                    continue;
                }

                // Calculate material needs for this product
                for (const item of materialsData) {
                    const materialId = item.materialId;
                    const quantityPerBatch = item.quantityNeeded || 0;
                    
                    // Formula: (quantityNeeded / productsPerBatch) * productQuantityNeeded
                    const materialQuantityNeeded = (quantityPerBatch / productsPerBatch) * productQuantityNeeded;

                    // Accumulate in the map
                    if (materialNeedsMap[materialId]) {
                        materialNeedsMap[materialId].quantityNeeded += materialQuantityNeeded;
                    } else {
                        materialNeedsMap[materialId] = {
                            materialId: materialId,
                            materialName: item.material?.name || 'Unknown Material',
                            quantityInStock: item.material?.quantityInStock || 0,
                            quantityNeeded: materialQuantityNeeded,
                            units: item.unitsNeeded || item.material?.units || 'units'
                        };
                    }
                }
            } catch (error) {
                // Log error but continue processing other products
                console.error(`Error processing product ${productId}:`, error.message);
                continue;
            }
        }

        // Convert map to array
        const result = Object.values(materialNeedsMap);
        return result;
    } catch (error) {
        throw error;
    }
}

materialModel.addMaterialToMaterialList = async (editedMaterial) => {
    try {
        const { data, error } = await supabase
            .from('materialList')
            .insert([editedMaterial])
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }    
}

materialModel.updateMaterialListByMaterialId = async (processId, materialId, editedMaterial) => {
    try {
        const { data, error } = await supabase
            .from('materialList')
            .update(editedMaterial)
            .eq('materialId', materialId)
            .eq('processId', processId)
            .select();
        
        if (error) throw error;
        return data;

    } catch (error) {
        throw error;
    }    
}

materialModel.deleteMaterialFromMaterialList = async (processId, materialId) => {
    try {
        const { data, error } = await supabase
            .from('materialList')
            .delete()
            .eq('processId', processId)
            .eq('materialId', materialId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
}

materialModel.getProcessesByMaterialId = async (materialId) => {

    try {
        const { data, error } = await supabase
            .from('materialList')
            .select(`
                process:processId (
                    processId,
                    name
                ),
                quantityNeeded,
                unitsNeeded
            `)
            .eq('materialId', materialId);
        
        if (error) throw error;
        
        const flattenedData = data.map(item => ({
            processId: item.process?.processId,
            processName: item.process?.name,
            quantityNeeded: item.quantityNeeded,
            units: item.unitsNeeded

        }));
        return flattenedData;
    } catch (error) {
        throw error;
    }    
}

module.exports = materialModel;