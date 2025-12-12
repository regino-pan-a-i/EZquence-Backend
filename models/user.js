/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');

const userModel = {};
/*
 * user{
 *  userId,
 *  firstName,
 *  lastName,
 *  email,
 *  createdAt,
 *  companyId,
 *  role
 *  approvalStatus
 * }
 *
 * Approval Status{
 * PENDING = 'PENDING',
 * APPROVED = 'APPROVED'
 * REJECTED = 'REJECTED'
 * }
 */

/***********************************
 * User Operations
 ************************************/

// Update user role
userModel.updateUserRole = async (userId, role) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!role) {
    throw new Error('role is required');
  }
  const { data, error } = await supabase
    .from('user')
    .update({
      role: role,
    })
    .eq('authId', userId)
    .select();

  if (error) throw error;
  return data[0];
};

// Update user approval status
userModel.updateUserApprovalStatus = async (userId, approvalStatus) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!approvalStatus) {
    throw new Error('approvalStatus is required');
  }
  const { data, error } = await supabase
    .from('user')
    .update({
      approvalStatus: approvalStatus,
    })
    .eq('userId', userId)
    .select();

  if (error) throw error;
  return data[0];
};

// Update user company
userModel.updateUserCompany = async (userId, companyId) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!companyId) {
    throw new Error('companyId is required');
  }
  const { data, error } = await supabase
    .from('user')
    .update({
      companyId: companyId,
    })
    .eq('userId', userId)
    .select();
  if (error) throw error;
  return data[0];
};

// Get all users by company ID
userModel.getUsersByCompanyId = async companyId => {
  if (!companyId) {
    throw new Error('companyId is required');
  }

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('companyId', companyId)
    .eq('role', 'WORKER')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
};

// Get user by ID
userModel.getUserById = async userId => {
  if (!userId) {
    throw new Error('userId is required');
  }

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) throw error;
  return data;
};

module.exports = userModel;
