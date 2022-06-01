const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Post, PostReaction } = require('../models');
const ApiError = require('../utils/ApiError');

const lookup = [
  {
    $lookup: {
      from: 'users',
      localField: 'creatorId',
      foreignField: '_id',
      as: 'creator',
    },
  },
  { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'creator.id': '$creator._id',
      id: '$_id',
    },
  },
  {
    $project: {
      'creator._id': 0,
      'creator.__v': 0,
      'creator.password': 0,
      'creator.createdAt': 0,
      'creator.updatedAt': 0,
      creatorId: 0,
      _id: 0,
      __v: 0,
    },
  },
];

const lookupPostReactions = [
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  },
  { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'user.id': '$user._id',
      id: '$_id',
    },
  },
  {
    $project: {
      'user.__v': 0,
      'user._id': 0,
      'user.password': 0,
      'user.createdAt': 0,
      'user.updatedAt': 0,
      _id: 0,
    },
  },
  {
    $project: {
      user: 1,
      type: 1,
    },
  },
];

const create = async (creatorId, body) => {
  return Post.create({ creatorId, ...body });
};

const query = async (filter, options) => {
  const recipes = Post.aggregate([...lookup, { $match: filter }]);
  const items = await Post.aggregatePaginate(recipes, options).then((result) => {
    const value = {};
    value.results = result.docs;
    value.page = result.page;
    value.limit = result.limit;
    value.totalPages = result.totalPages;
    value.totalResults = result.totalDocs;
    return value;
  });
  return items;
};

const getById = async (id) => {
  const items = await Post.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookup]).limit(1);
  return items.at(0);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  Object.assign(item, updateBody);
  await Post.updateOne({ _id: item.id }, { $set: updateBody });
  return getById(id);
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
  let item = await PostReaction.findOne({ postId, userId });
  if (!item) {
    item = await PostReaction.create({ userId, postId, type });
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

const getPostReactions = async (id, options) => {
  const data = PostReaction.aggregate([{ $match: { postId: mongoose.Types.ObjectId(id) } }, ...lookupPostReactions]);
  const items = await PostReaction.aggregatePaginate(data, options).then((result) => {
    const value = {};
    value.results = result.docs;
    value.page = result.page;
    value.limit = result.limit;
    value.totalPages = result.totalPages;
    value.totalResults = result.totalDocs;
    return value;
  });
  return items;
};

const search = async (text, options) => {
  const posts = Post.aggregate([
    {
      $match: {
        $text: {
          $search: text,
        },
      },
    },
    { $addFields: { score: { $meta: 'textScore' }, id: '$_id' } },
    { $match: { score: { $gt: 0.5 } } },
    {
      $project: {
        __v: 0,
        _id: 0,
      },
    },
    ...lookup,
  ]);
  const items = await Post.aggregatePaginate(posts, options).then((result) => {
    const value = {};
    value.results = result.docs;
    value.page = result.page;
    value.limit = result.limit;
    value.totalPages = result.totalPages;
    value.totalResults = result.totalDocs;
    return value;
  });
  return items;
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  react,
  deleteReaction,
  getPostReactions,
  search,
};
