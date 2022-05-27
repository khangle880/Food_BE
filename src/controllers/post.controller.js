const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services');

const create = catchAsync(async (req, res) => {
  const item = await postService.create(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['viewRange', 'tags']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const item = await postService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(item);
});

const updateById = catchAsync(async (req, res) => {
  const item = await postService.updateById(req.params.id, req.body);
  res.send(item);
});

const deleteById = catchAsync(async (req, res) => {
  await postService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

const react = catchAsync(async (req, res) => {
  const item = await postService.react(req.user.id, req.params.id, req.body.type);
  res.status(httpStatus.CREATED).send(item);
});

const deleteReaction = catchAsync(async (req, res) => {
  await postService.deleteReaction(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Delete reaction Successfully');
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
  react,
  deleteReaction,
};
