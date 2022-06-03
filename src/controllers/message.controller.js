const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const getMessage = catchAsync(async (req, res) => {
  const body = pick(req.body, ['message']);
  const messages = await messageService.getMessage(req.user.languageSetting, body.message, req.user.id);

  res.send(messages.data);
});

module.exports = {
  getMessage,
};
