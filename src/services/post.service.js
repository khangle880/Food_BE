const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Post, PostReaction } = require('../models');
const ApiError = require('../utils/ApiError');

const lookup = (userId) => {
  const userIdObj = mongoose.Types.ObjectId(userId);
  return [
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
        'statusWithMe.reaction.id': '$statusWithMe.reaction._id',
        id: '$_id',
      },
    },
    {
      $lookup: {
        from: 'postreactions',
        let: { postId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: [userIdObj, '$userId'] }, { $eq: ['$postId', '$$postId'] }],
              },
            },
          },
        ],
        as: 'reaction',
      },
    },
    {
      $addFields: {
        'statusWithMe.reaction': { $arrayElemAt: ['$reaction', 0] },
      },
    },

    {
      $project: {
        'creator._id': 0,
        'creator.__v': 0,
        'creator.password': 0,
        'creator.createdAt': 0,
        'creator.updatedAt': 0,
        reaction: 0,
        'statusWithMe.reaction._id': 0,
        'statusWithMe.reaction.__v': 0,
        creatorId: 0,
        _id: 0,
        __v: 0,
      },
    },
    {
      $replaceWith: {
        $arrayToObject: {
          $filter: {
            input: { $objectToArray: '$$ROOT' },
            cond: { $not: { $in: ['$$this.v', [null, '', {}, [{}]]] } },
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ];
};

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
  {
    $replaceWith: {
      $arrayToObject: {
        $filter: {
          input: { $objectToArray: '$$ROOT' },
          cond: { $not: { $in: ['$$this.v', [null, '', {}, [{}]]] } },
        },
      },
    },
  },
  { $sort: { createdAt: -1 } },
];

const query = async (userId, filter, options) => {
  const recipes = Post.aggregate([{ $match: filter }, ...lookup(userId)]);
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

const getById = async (userId, id) => {
  const items = await Post.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookup(userId)]).limit(1);
  return items.at(0);
};

const create = async (creatorId, body) => {
  const post = await Post.create({ creatorId, ...body });
  return getById(creatorId, post.id);
};
const updateById = async (userId, id, updateBody) => {
  let item = await getById(userId, id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await Post.updateOne({ _id: item.id }, { $set: updateBody });
  item = await getById(userId, id);
  return getById(id);
};

const deleteById = async (id) => {
  const item = await Post.findById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await item.remove();
  return item;
};

const react = async (userId, postId, type) => {
  const post = await getById(userId, postId);
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
  const post = await getById(userId, postId);
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

const search = async (userId, filter, options) => {
  const newFilter = filter;
  Object.keys(filter).forEach(function (key) {
    if (filter[key].match(/^[0-9a-fA-F]{24}$/)) {
      newFilter[key] = mongoose.Types.ObjectId(filter[key]);
    }
  });
  const pipe = [];
  if (filter.q !== undefined) {
    pipe.push(
      ...[
        {
          $match: {
            $text: {
              $search: filter.q,
            },
          },
        },
        { $addFields: { score: { $meta: 'textScore' } } },
        { $match: { score: { $gt: 0.5 } } },
      ]
    );
  }
  delete newFilter.q;
  pipe.push(...[{ $match: newFilter }, ...lookup(userId)]);
  const posts = Post.aggregate(pipe);
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
const getPosts = async (userId, options) => {
  const aggregate = Post.aggregate([{ $match: { creatorId: mongoose.Types.ObjectId(userId) } }, ...lookup(userId)]);
  const items = await Post.aggregatePaginate(aggregate, options).then((result) => {
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
  getPosts,
};
