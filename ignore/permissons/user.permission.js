const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const verifyUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return next();
});

module.exports = verifyUser;
