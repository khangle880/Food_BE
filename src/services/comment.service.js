const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Comment, CommentReaction } = require('../models');
const ApiError = require('../utils/ApiError');

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
      'commentReactions.user.role': 0,
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
