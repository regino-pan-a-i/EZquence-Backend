/***********************************
 * Require Statements
 ************************************/
const feedbackModel = require('../models/feedback');
const { setUserRole } = require('./companyController');

const feedbackController = {};

/***********************************
 * Feedback Controller Functions
 ************************************/

// Create new feedback (Customer)
feedbackController.createFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    const companyId = req.user.user_company;
    const userId = req.user.usr_id; // Get user ID from JWT token

    if (!companyId || !message) {
      return res.status(400).json({
        success: false,
        error: 'companyId and message are required',
      });
    }

    const feedbackData = {
      userId,
      companyId,
      message,
    };

    const feedback = await feedbackModel.createFeedback(feedbackData);

    return res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
};

// Get feedback by user ID (Customer)
feedbackController.getFeedbackByUserId = async (req, res) => {
  try {
    const userId = req.user.usr_id; // Get user ID from JWT token

    const feedback = await feedbackModel.getFeedbackByUserId(userId);

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
};

// Get all feedback for a company (Admin only)
feedbackController.getFeedbackByCompanyId = async (req, res) => {
  try {
    const companyId = req.user.user_company;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'companyId is required',
      });
    }

    const feedback = await feedbackModel.getFeedbackByCompanyId(companyId);

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error retrieving company feedback:', error);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
};

// Update feedback resolved status (Admin only)
feedbackController.updateFeedbackResolved = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!feedbackId) {
      return res.status(400).json({
        success: false,
        error: 'feedbackId is required',
      });
    }

    const feedback = await feedbackModel.updateFeedbackResolved(feedbackId);

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
};

module.exports = feedbackController;
