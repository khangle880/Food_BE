const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');

const create = catchAsync(async (req, res) => {
  const item = await commentService.create(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postId', 'parentId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await commentService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const item = await commentService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  res.send(item);
});

const updateById = catchAsync(async (req, res) => {
  const item = await commentService.updateById(req.params.id, req.body);
  res.send(item);
});

const deleteById = catchAsync(async (req, res) => {
  await commentService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

const react = catchAsync(async (req, res) => {
  const item = await commentService.react(req.user.id, req.params.id, req.body.type);
  res.status(httpStatus.CREATED).send(item);
});

const deleteReaction = catchAsync(async (req, res) => {
  await commentService.deleteReaction(req.user.id, req.params.id);
  res.status(httpStatus.OK).send('Delete reaction Successfully');
});

const getCommentReactions = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const items = await commentService.getCommentReactions(req.params.id, options);
  res.send(items);
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
  react,
  deleteReaction,
  getCommentReactions,
};
