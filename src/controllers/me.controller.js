const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getMe = catchAsync(async (req, res) => {
  res.send(req.user);
});

const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateById(req.user.id, req.body);
  res.send(user);
});

const deleteMe = catchAsync(async (req, res) => {
  await userService.deleteById(req.user.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.status(httpStatus.OK).send('Password Change Successfully');
});

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  changePassword,
};
