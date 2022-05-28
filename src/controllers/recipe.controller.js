const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { recipeService } = require('../services');

const create = catchAsync(async (req, res) => {
  const body = { ...req.body, creatorId: req.user.id };
  const item = await recipeService.create(body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'servings', 'level', 'ingredients', 'specialGoals', 'menuTypes', 'cuisineId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await recipeService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const item = await recipeService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  res.send(item);
});

const updateById = catchAsync(async (req, res) => {
  const item = await recipeService.updateById(req.params.id, req.body);
  res.send(item);
});

const deleteById = catchAsync(async (req, res) => {
  await recipeService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

const likeRecipe = catchAsync(async (req, res) => {
  await recipeService.likeRecipe(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Like Successfully');
});

const dislikeRecipe = catchAsync(async (req, res) => {
  await recipeService.dislikeRecipe(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Dislike Successfully');
});

const markCook = catchAsync(async (req, res) => {
  await recipeService.markCook(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Mark Successfully');
});

const unmarkCook = catchAsync(async (req, res) => {
  await recipeService.unmarkCook(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Unmark Successfully');
});

const vote = catchAsync(async (req, res) => {
  const item = await recipeService.vote(req.user.id, req.params.id, req.body.point);
  res.status(httpStatus.CREATED).send(item);
});

const unvote = catchAsync(async (req, res) => {
  await recipeService.unvote(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Delete Rating Successfully');
});

const getLikedUsers = catchAsync(async (req, res) => {
  const items = await recipeService.getLikedUsers(req.params.id);
  res.send(items);
});

const getCookedUsers = catchAsync(async (req, res) => {
  const items = await recipeService.getCookedUsers(req.params.id);
  res.send(items);
});

const getRatingUsers = catchAsync(async (req, res) => {
  const items = await recipeService.getRatingUsers(req.params.id);
  res.send(items);
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
  likeRecipe,
  dislikeRecipe,
  markCook,
  unmarkCook,
  vote,
  unvote,
  getLikedUsers,
  getCookedUsers,
  getRatingUsers,
};
