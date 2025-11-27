/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');
const materialModel = require('./material');

const processModel = {};

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

processModel.getProcessListByCompanyId = async companyId => {
  const { data, error } = await supabase
    .from('process')
    .select('*')
    .eq('companyId', companyId);

  if (error) throw error;
  return data;
};

processModel.getProcessByProductId = async productId => {
  const { data, error } = await supabase
    .from('process')
    .select('*')
    .eq('productId', productId);

  if (error) throw error;

  const materials = await materialModel.getMaterialsByMaterialList(
    data[0].processId
  );

  if (materials) data[0].materials = materials;

  return data;
};

processModel.createProcess = async (processData, companyId) => {
  const { data, error } = await supabase
    .from('process')
    .insert([
      {
        name: processData.name,
        details: processData.details,
        productsPerBatch: processData.productsPerBatch,
        productId: processData.productId,
        companyId: companyId,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

processModel.updateProcess = async (id, processData) => {
  // Separate materials from process data
  const { materials, ...processFields } = processData;

  // Update the process table (only process-specific fields)
  const { data, error } = await supabase
    .from('process')
    .update(processFields)
    .eq('productId', id)
    .select();

  if (error) throw error;

  // If materials array is provided, update the materialList
  if (materials && Array.isArray(materials) && materials.length > 0) {
    const processId = data[0].processId;

    // Delete existing material list entries for this process
    const { error: deleteError } = await supabase
      .from('materialList')
      .delete()
      .eq('processId', processId);

    if (deleteError) throw deleteError;

    // Insert updated material list entries
    const materialListEntries = materials.map(material => ({
      processId: processId,
      materialId: material.materialId,
      quantityNeeded: material.quantityNeeded,
      unitsNeeded: material.units,
      companyId: material.companyId,
    }));

    const { error: insertError } = await supabase
      .from('materialList')
      .insert(materialListEntries);

    if (insertError) throw insertError;

    // Fetch the updated process with materials to return
    const updatedProcess = await processModel.getProcessByProductId(id);
    return updatedProcess;
  }

  return data;
};

processModel.deleteProcess = async id => {
  const { data, error } = await supabase
    .from('process')
    .delete()
    .eq('productId', id);

  if (error) throw error;
  return data;
};

module.exports = processModel;
