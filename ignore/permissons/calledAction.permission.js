const httpStatus = require('http-status');
const { CalledAction, TrainingItem } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');
const catchAsync = require('../../src/utils/catchAsync');

const verifyItem = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    const calledAction = await CalledAction.findById(req.params.id).populate('intentId');
    if (!calledAction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Called action not found');
    }
    const intent = calledAction.intentId;
    if (!intent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Intent not found');
    }
    const chatbot = (await intent.populate('chatbotId')).chatbotId;
    if (!chatbot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
    }
    if (chatbot.creatorId !== req.user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return next();
});

const checkIntentId = async (user, intentId) => {
  const intent = await TrainingItem.findById(intentId).populate('chatbotId');
  if (!intent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Intent not found');
  }
  if (intent.type !== 'INTENT') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Intent not found');
  }
  const chatbot = intent.chatbotId;
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  if (chatbot.creatorId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
};

const canCreate = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkIntentId(req.user, req.body.intentId);
  }
  return next();
});

const canViewItems = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await checkIntentId(req.user, req.query.intentId);
  }
  return next();
});
module.exports = { verifyItem, canCreate, canViewItems };
