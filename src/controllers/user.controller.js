const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, productService, postService, recipeService } = require('../services');

const create = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const user = await userService.getById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateById = catchAsync(async (req, res) => {
  const user = await userService.updateById(req.params.id, req.body);
  res.send(user);
});

const deleteById = catchAsync(async (req, res) => {
  await userService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

const follow = catchAsync(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't follow yourseft");
  }
  const user = await userService.follow(req.user.id, req.params.id);
  res.send(user);
});

const unFollow = catchAsync(async (req, res) => {
  if (req.user.id === req.params.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't unfollow yourseft");
  }
  const user = await userService.unFollow(req.user.id, req.params.id);
  res.send(user);
});

const getLikedRecipes = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await userService.getLikedRecipes(req.params.id, options);
  res.send(items);
});

const getRecipes = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await recipeService.getRecipes(req.params.id, options);
  res.send(items);
});

const getProducts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await productService.getProducts(req.params.id, options);
  res.send(items);
});

const getPosts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await postService.getPosts(req.params.id, options);
  res.send(items);
});

const getFollowingUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await userService.getFollowingUsers(req.params.id, options);
  res.send(items);
});

const getFollowerUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await userService.getFollowerUsers(req.params.id, options);
  res.send(items);
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
  follow,
  unFollow,
  getLikedRecipes,
  getRecipes,
  getProducts,
  getPosts,
  getFollowingUsers,
  getFollowerUsers,
};
