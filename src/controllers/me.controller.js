const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userService, productService, postService, recipeService } = require('../services');

const getMe = catchAsync(async (req, res) => {
  const profile = await userService.getById(req.user.id);
  res.send(profile);
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
  const items = await recipeService.getRecipes(req.user.id, options);
  res.send(items);
});

const getProducts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await productService.getProducts(req.user.id, options);
  res.send(items);
});

const getPosts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await postService.getPosts(req.user.id, options);
  res.send(items);
});

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  changePassword,
  getLikedRecipes,
  getRecipes,
  getProducts,
  getPosts,
};
