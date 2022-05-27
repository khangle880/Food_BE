const httpStatus = require('http-status');
const { Chatbot } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const verifyChatbot = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    const chatbot = await Chatbot.findById(req.params.id);
    if (!chatbot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
    }
    if (chatbot.creatorId !== req.user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return next();
});

module.exports = verifyChatbot;
