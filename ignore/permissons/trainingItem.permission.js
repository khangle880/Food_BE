const httpStatus = require('http-status');
const { TrainingItem, Chatbot } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const verifyItem = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    const item = await TrainingItem.findById(req.params.id).populate('chatbotId');
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Training item not found');
    }
    const chatbot = item.chatbotId;
    if (!chatbot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
    }
    if (chatbot.creatorId !== req.user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return next();
});

const checkChatbotId = async (user, chatbotId) => {
  const chatbot = await Chatbot.findById(chatbotId);
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  if (chatbot.creatorId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
};

const canViewItems = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkChatbotId(req.user, req.query.chatbotId);
  }
  return next();
});

const canCreate = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkChatbotId(req.user, req.body.chatbotId);
  }
  return next();
});

module.exports = {
  verifyItem,
  canCreate,
  canViewItems,
};
