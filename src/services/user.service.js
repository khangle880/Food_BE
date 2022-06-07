const httpStatus = require('http-status');
const mongoose = require('mongoose');
const recipeService = require('./recipe.service');
const { User, Recipe, RecipeLike } = require('../models');
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

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const updateById = async (userId, updateBody) => {
  const user = await getById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteById = async (id) => {
  const item = await getById(id);
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

const search = async (text, options) => {
  const users = User.aggregate([
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
        password: 0,
      },
    },
  ]);
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

const getRecipes = async (userId, options) => {
  const aggregate = Recipe.aggregate([
    { $match: { creatorId: mongoose.Types.ObjectId(userId) } },
    ...recipeService.lookup(userId),
  ]);
  const items = await Recipe.aggregatePaginate(aggregate, options).then((result) => {
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
  getRecipes,
};
