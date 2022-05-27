const httpStatus = require('http-status');
const { Post, PostReaction } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  return Post.create(body);
};

const query = async (filter, options) => {
  const items = await Post.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return Post.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await item.remove();
  return item;
};

const react = async (userId, postId, type) => {
  const post = await getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  const item = await PostReaction.findOne({ postId, userId });
  if (!item) {
    await PostReaction.create({ userId, postId, type });
  } else {
    Object.assign(item, { type });
    await item.save();
  }
  return item;
};

const deleteReaction = async (userId, postId) => {
  const post = await getById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  const item = await PostReaction.findOne({ userId, postId });
  if (item) {
    await item.remove();
  }
  return item;
};

const search = async (text, options) => {
  return query({ $text: { $search: text } }, options);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  react,
  deleteReaction,
  search,
};
