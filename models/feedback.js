/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');

const feedbackModel = {};

/*
 * Customer Feedback schema
 *
 * customerFeedback{
 *   feedbackId,
 *   userId,
 *   companyId,
 *   message,
 *   dateCreated,
 *   resolved
 * }
 */

/***********************************
 * Feedback CRUD Operations
 ************************************/

// Create new feedback
feedbackModel.createFeedback = async feedbackData => {
  const { data, error } = await supabase
    .from('customerFeedback')
    .insert([
      {
        userId: feedbackData.userId,
        companyId: feedbackData.companyId,
        message: feedbackData.message,
        resolved: false,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

// Get all feedback by user ID
feedbackModel.getFeedbackByUserId = async userId => {
  const { data, error } = await supabase
    .from('customerFeedback')
    .select('*')
    .eq('userId', userId)
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

// Get all feedback for a company
feedbackModel.getFeedbackByCompanyId = async companyId => {
  const { data, error } = await supabase
    .from('customerFeedback')
    .select('*')
    .eq('companyId', companyId)
    .order('dateCreated', { ascending: false });

  if (error) throw error;
  return data;
};

// Update feedback resolved status
feedbackModel.updateFeedbackResolved = async (feedbackId) => {
  if (!feedbackId) {
    throw new Error('feedbackId is required');
  }

  const { data, error } = await supabase
    .from('customerFeedback')
    .update({ resolved: true })
    .eq('feedbackId', feedbackId)
    .select();

  if (error) throw error;
  return data[0];
};

// Get feedback by ID
feedbackModel.getFeedbackById = async feedbackId => {
  const { data, error } = await supabase
    .from('customerFeedback')
    .select('*')
    .eq('feedbackId', feedbackId)
    .single();

  if (error) throw error;
  return data;
};

module.exports = feedbackModel;
