const httpStatus = require('http-status');
const pick = require('../utils/pick');
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
  await userService.changePassword(req.user, req.body);
  res.status(httpStatus.OK).send('Password Change Successfully');
});

const getLikedRecipes = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await userService.getLikedRecipes(req.user.id, options);
  res.send(items);
});

const getRecipes = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await userService.getRecipes(req.user.id, options);
  res.send(items);
});

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  changePassword,
  getLikedRecipes,
  getRecipes,
};
