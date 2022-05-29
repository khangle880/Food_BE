const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Comment, CommentReaction } = require('../models');
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

const lookupCommentReactions = [
  {
    $lookup: {
      from: 'commentreactions',
      localField: '_id',
      foreignField: 'commentId',
      as: 'commentReactions',
    },
  },
  { $unwind: { path: '$commentReactions', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'commentReactions.userId',
      foreignField: '_id',
      as: 'commentReactions.user',
    },
  },
  { $unwind: { path: '$commentReactions.user', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      'commentReactions.user': 1,
      'commentReactions.type': 1,
    },
  },
  {
    $project: {
      'commentReactions.user.__v': 0,
      'commentReactions.user._id': 0,
      'commentReactions.user.password': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      results: {
        $push: '$commentReactions',
      },
    },
  },
  {
    $project: {
      _id: 0,
      results: {
        $cond: {
          if: { $eq: ['$results', [{}]] },
          then: [],
          else: '$results',
        },
      },
    },
  },
];

const create = async (creatorId, body) => {
  return Comment.create({ creatorId, ...body });
};

const query = async (filter, options) => {
  const recipes = Comment.aggregate([...lookup, { $match: filter }]);
  const items = await Comment.aggregatePaginate(recipes, options).then((result) => {
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
  const items = await Comment.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookup]).limit(1);
  return items.at(0);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(item, updateBody);
  await Comment.updateOne({ _id: item.id }, { $set: updateBody });
  return getById(id);
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
  let item = await CommentReaction.findOne({ commentId, userId });
  if (!item) {
    item = await CommentReaction.create({ userId, commentId, type });
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

const getCommentReactions = async (id) => {
  const items = await Comment.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookupCommentReactions]);
  return items.at(0);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  react,
  deleteReaction,
  getCommentReactions,
};
