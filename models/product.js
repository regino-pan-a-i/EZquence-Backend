/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');

const productModel = {};

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

productModel.getProductListByCompanyId = async companyId => {
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
};

productModel.getProductDetails = async id => {
  let { data, error } = await supabase
    .from('product')
    .select('*, productImage ( productId, imageURL )')
    .eq('productId', id);
  if (error) throw error;
  return data;
};

productModel.getProductName = async id => {
  let { data, error } = await supabase
    .from('product')
    .select('name')
    .eq('productId', id);
  if (error) throw error;
  return data[0];
};

productModel.createProduct = async productData => {
  if (!productData.companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('product')
    .insert([
      {
        name: productData.name,
        price: productData.price,
        details: productData.details,
        companyId: BigInt(productData.companyId),
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

productModel.updateProduct = async (id, updateData) => {
  const { data, error } = await supabase
    .from('product')
    .update(updateData)
    .eq('productId', id)
    .select();

  if (error) throw error;
  return data;
};

productModel.updateImage = async (id, imageData) => {
  const { data, error } = await supabase
    .from('productImage')
    .update(imageData)
    .eq('productId', id)
    .select();

  if (error) throw error;
  return data;
};

productModel.deleteProduct = async id => {
  const { data, error } = await supabase
    .from('product')
    .delete()
    .eq('productId', id);

  if (error) throw error;
  return data;
};

productModel.searchProducts = async query => {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .or(`name.ilike.%${query}%,details.ilike.%${query}%`);

  if (error) throw error;
  return data;
};

productModel.getProductsByCategory = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('companyId', BigInt(companyId));

  if (error) throw error;
  return data;
};

module.exports = productModel;
