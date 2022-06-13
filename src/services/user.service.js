const httpStatus = require('http-status');
const mongoose = require('mongoose');
const recipeService = require('./recipe.service');
const { User, RecipeLike } = require('../models');
const ApiError = require('../utils/ApiError');

const lookupLikedRecipes = [
  {
    $lookup: {
      from: 'recipes',
      localField: 'recipeId',
      foreignField: '_id',
      as: 'recipe',
    },
  },
  { $unwind: { path: '$recipe', preserveNullAndEmptyArrays: true } },
  { $replaceRoot: { newRoot: '$recipe' } },
];
const lookupProfile = [
  {
    $lookup: {
      from: 'recipes',
      localField: '_id',
      foreignField: 'creatorId',
      as: 'recipes',
    },
  },
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'creatorId',
      as: 'posts',
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'creatorId',
      as: 'products',
    },
  },
  {
    $addFields: {
      totalRecipes: { $size: '$recipes' },
      totalPosts: { $size: '$posts' },
      totalProducts: { $size: '$products' },
      id: '$_id',
    },
  },
  {
    $project: {
      _id: 0,
      __v: 0,
      recipes: 0,
      posts: 0,
      products: 0,
      password: 0,
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
];

const create = async (body) => {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(body);
};

const query = async (filter, options) => {
  const items = await User.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return User.findById(id);
};
const getProfile = async (userId) => {
  const items = await User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(userId) } }, ...lookupProfile]).limit(1);
  return items.at(0);
};

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const updateById = async (userId, updateBody) => {
  let user = await getById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  user = await getById(userId);
  return user;
};

const deleteById = async (id) => {
  const item = await User.findById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await item.remove();
  return item;
};

const follow = async (userId, otherUserId) => {
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user not exist');
  }
  let item = await User.findOne({ _id: userId, followingUsers: otherUserId });
  if (!item) {
    item = await getById(userId);
    item.followingUsers.push(otherUserId);
    await item.save();
    otherUser.followerUsers.push(userId);
    await otherUser.save();
  }
  return item;
};

const unFollow = async (userId, otherUserId) => {
  const otherUser = await getById(otherUserId);
  if (!otherUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user not exist');
  }
  const item = await User.findOne({ _id: userId, followingUsers: otherUserId });
  if (item) {
    item.followingUsers = item.followingUsers.filter((id) => id.toString() !== otherUserId);
    await item.save();
    otherUser.followerUsers = otherUser.followerUsers.filter((id) => id.toString() !== userId);
    await otherUser.save();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user not followed yet');
  }
  return item;
};

const changePassword = async (user, body) => {
  if (user.isPasswordMatch(body.oldPassword)) {
    Object.assign(user, { password: body.newPassword });
    await user.save();
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password Incorrect');
  }
  return user;
};

const search = async (filter, options) => {
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
  pipe.push(
    ...[
      { $addFields: { id: '$_id' } },
      {
        $project: {
          __v: 0,
          _id: 0,
          password: 0,
        },
      },
    ]
  );

  const users = User.aggregate(pipe);
  const items = await User.aggregatePaginate(users, options).then((result) => {
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

const getLikedRecipes = async (userId, options) => {
  const aggregate = RecipeLike.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    ...lookupLikedRecipes,
    ...recipeService.lookup(userId),
  ]);
  const items = await RecipeLike.aggregatePaginate(aggregate, options).then((result) => {
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
  getByEmail,
  query,
  follow,
  unFollow,
  changePassword,
  search,
  getLikedRecipes,
  getProfile,
};
