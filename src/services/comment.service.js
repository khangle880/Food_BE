const httpStatus = require('http-status');
const { Comment, CommentReaction } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  return Comment.create(body);
};

const query = async (filter, options) => {
  const items = await Comment.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return Comment.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  await item.remove();
  return item;
};

const react = async (userId, commentId, type) => {
  const comment = await getById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  const item = await CommentReaction.findOne({ commentId, userId });
  if (!item) {
    await CommentReaction.create({ userId, commentId, type });
  } else {
    Object.assign(item, { type });
    await item.save();
  }
  return item;
};

const deleteReaction = async (userId, commentId) => {
  const comment = await getById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  const item = await CommentReaction.findOne({ userId, commentId });
  if (item) {
    await item.remove();
  }
  return item;
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  react,
  deleteReaction,
};
