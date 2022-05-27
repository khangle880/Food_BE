const httpStatus = require('http-status');
const { StoredItem, Model } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const verifyItem = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    const item = await StoredItem.findById(req.params.id).populate('modelId');
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stored item not found');
    }
    const model = item.modelId;
    if (!model) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
    }
    const chatbot = (await model.populate('chatbotId')).chatbotId;
    if (!chatbot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
    }
    if (chatbot.creatorId !== req.user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return next();
});

const checkModelId = async (user, modelId) => {
  const model = await Model.findById(modelId).populate('chatbotId');
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  const chatbot = model.chatbotId;
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  if (chatbot.creatorId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
};

const canCreate = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkModelId(req.user, req.body.modelId);
  }
  return next();
});

const canViewItems = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkModelId(req.user, req.query.modelId);
  }
  return next();
});
module.exports = { verifyItem, canCreate, canViewItems };
