/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');

const companyModel = {};

/*
 *   Company schema
 *
 * company{
 *   companyId,
 *   name,
 *   industry,
 *   description,
 *   logoURL,
 *   dateCreated
 * }
 *
 * productionGoals{
 *   productionGoalId
 *   dateCreated,
 *   goalValue,
 *   productId,
 *   companyId,
 *   effectiveDate,
 *   endDate
 * }
 */

/***********************************
 * Company CRUD Operations
 ************************************/

// Create a new company
companyModel.createCompany = async companyData => {
  const { data, error } = await supabase
    .from('company')
    .insert([
      {
        name: companyData.name,
        industry: companyData.industry,
        description: companyData.description,
        logoURL: companyData.logoURL,
      },
    ])
    .select();
  console.log(error);
  if (error) throw error;
  return data;
};

// Get company by ID
companyModel.getCompanyById = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('company')
    .select('*')
    .eq('companyId', BigInt(companyId))
    .single();

  if (error) throw error;
  return data;
};

// Get all companies
companyModel.getAllCompanies = async () => {
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

// Update company
companyModel.updateCompany = async (companyId, updateData) => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('company')
    .update(updateData)
    .eq('companyId', BigInt(companyId))
    .select();

  if (error) throw error;
  return data;
};

// Delete company
companyModel.deleteCompany = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('company')
    .delete()
    .eq('companyId', BigInt(companyId));

  if (error) throw error;
  return data;
};

// Search companies by name or industry
companyModel.searchCompanies = async query => {
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .or(
      `name.ilike.%${query}%,industry.ilike.%${query}%,description.ilike.%${query}%`
    );

  if (error) throw error;
  return data;
};

/***********************************
 * Production Goals CRUD Operations
 ************************************/

// Create a new production goal
companyModel.createProductionGoal = async goalData => {
  if (!goalData.companyId) {
    throw new Error('companyId is required');
  }
  if (!goalData.productId) {
    throw new Error('productId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .insert([
      {
        goalValue: goalData.goalValue,
        productId: goalData.productId,
        companyId: goalData.companyId,
        effectiveDate: goalData.effectiveDate,
        endDate: goalData.endDate,
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

// Get production goal by ID
companyModel.getProductionGoalById = async goalId => {
  if (!goalId) {
    throw new Error('productionGoalId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .select('*')
    .eq('productionGoalId', BigInt(goalId))
    .single();

  if (error) throw error;
  return data;
};

// Get all production goals for a company
companyModel.getProductionGoalsByCompanyId = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .select('*')
    .eq('companyId', BigInt(companyId))
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

// Get all production goals for a product
companyModel.getProductionGoalsByProductId = async productId => {
  if (!productId) {
    throw new Error('productId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .select('*')
    .eq('productId', BigInt(productId))
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

// Get active production goals (current date is between effectiveDate and endDate)
companyModel.getActiveProductionGoals = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const currentDate = new Date().toISOString();

  const { data, error } = await supabase
    .from('productionGoals')
    .select('*')
    .eq('companyId', BigInt(companyId))
    .lte('effectiveDate', currentDate)
    .gte('endDate', currentDate);

  if (error) throw error;
  return data;
};

// Update production goal
companyModel.updateProductionGoal = async (goalId, updateData) => {
  if (!goalId) {
    throw new Error('productionGoalId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .update(updateData)
    .eq('productionGoalId', BigInt(goalId))
    .select();

  if (error) throw error;
  return data;
};

// Delete production goal
companyModel.deleteProductionGoal = async goalId => {
  if (!goalId) {
    throw new Error('productionGoalId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .delete()
    .eq('productionGoalId', BigInt(goalId));

  if (error) throw error;
  return data;
};

// Get production goals by date range
companyModel.getProductionGoalsByDateRange = async (
  companyId,
  startDate,
  endDate
) => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('productionGoals')
    .select('*')
    .eq('companyId', BigInt(companyId))
    .gte('effectiveDate', startDate)
    .lte('endDate', endDate)
    .order('effectiveDate', { ascending: true });

  if (error) throw error;
  return data;
};

module.exports = companyModel;
