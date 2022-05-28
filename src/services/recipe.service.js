const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Recipe, RecipeLike, RecipeCook, Rating } = require('../models');
const ApiError = require('../utils/ApiError');

const lookup = [
  {
    $lookup: {
      from: 'recipelikes',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'likedUsers',
    },
  },
  {
    $lookup: {
      from: 'recipecooks',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'cookedUsers',
    },
  },
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'ratings',
    },
  },
  {
    $lookup: {
      from: 'specialgoals',
      localField: 'specialGoals',
      foreignField: '_id',
      as: 'specialGoals',
    },
  },
  {
    $addFields: {
      specialGoals: '$specialGoals.name',
    },
  },
  {
    $lookup: {
      from: 'menutypes',
      localField: 'menuTypes',
      foreignField: '_id',
      as: 'menuTypes',
    },
  },
  {
    $addFields: {
      menuTypes: '$menuTypes.name',
    },
  },
  { $unwind: { path: '$ingredients', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'ingredients',
      localField: 'ingredients.ingredientId',
      foreignField: '_id',
      as: 'ingredients.ingredientId',
    },
  },
  {
    $unwind: { path: '$ingredients.ingredientId', preserveNullAndEmptyArrays: true },
  },
  {
    $lookup: {
      from: 'units',
      localField: 'ingredients.unitId',
      foreignField: '_id',
      as: 'ingredients.unitId',
    },
  },
  {
    $unwind: { path: '$ingredients.unitId', preserveNullAndEmptyArrays: true },
  },
  {
    $addFields: {
      'ingredients.name': '$ingredients.ingredientId.name',
      'ingredients.unit': '$ingredients.unitId.name',
    },
  },
  {
    $project: {
      'ingredients.ingredientId': 0,
      'ingredients.unitId': 0,
      'ingredients._id': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      ingredients: {
        $push: '$ingredients',
      },
      doc: { $first: '$$ROOT' },
    },
  },
  { $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { ingredients: '$ingredients' }] } } },
  {
    $addFields: {
      totalLikes: { $size: '$likedUsers' },
      totalCook: { $size: '$cookedUsers' },
      totalRating: { $size: '$ratings' },
      avgRating: { $avg: '$ratings.point' },
      id: '$_id',
    },
  },
  {
    $project: { _id: 0, __v: 0, likedUsers: 0, cookedUsers: 0, ratings: 0 },
  },
];

const lookupLikedUsers = [
  {
    $lookup: {
      from: 'recipelikes',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'likedUsers',
    },
  },
  { $unwind: { path: '$likedUsers', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'likedUsers.userId',
      foreignField: '_id',
      as: 'likedUsers',
    },
  },
  { $unwind: { path: '$likedUsers', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'likedUsers.id': '$likedUsers._id',
    },
  },
  {
    $project: {
      'likedUsers.__v': 0,
      'likedUsers._id': 0,
      'likedUsers.password': 0,
      'likedUsers.role': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      results: {
        $push: '$likedUsers',
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

const lookupCookedUsers = [
  {
    $lookup: {
      from: 'recipecooks',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'cookedUsers',
    },
  },
  { $unwind: { path: '$cookedUsers', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'cookedUsers.userId',
      foreignField: '_id',
      as: 'cookedUsers',
    },
  },
  { $unwind: { path: '$cookedUsers', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'cookedUsers.id': '$cookedUsers._id',
    },
  },
  {
    $project: {
      'cookedUsers.__v': 0,
      'cookedUsers._id': 0,
      'cookedUsers.password': 0,
      'cookedUsers.role': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      results: {
        $push: '$cookdUsers',
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

const lookupRatingUsers = [
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'recipeId',
      as: 'ratings',
    },
  },
  { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'ratings.userId',
      foreignField: '_id',
      as: 'ratings',
    },
  },
  { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'ratings.id': '$ratings._id',
    },
  },
  {
    $project: {
      'ratings.__v': 0,
      'ratings._id': 0,
      'ratings.password': 0,
      'ratings.role': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      results: {
        $push: '$ratings',
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

const create = async (body) => {
  return Recipe.create(body);
};

const query = async (filter, options) => {
  const recipes = Recipe.aggregate([...lookup, { $match: filter }]);
  const items = await Recipe.aggregatePaginate(recipes, options).then((result) => {
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
  const items = await Recipe.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookup]).limit(1);
  return items.at(0);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  Object.assign(item, updateBody);
  await Recipe.updateOne({ _id: item.id }, { $set: updateBody });
  return getById(id);
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  await item.remove();
  return item;
};

const likeRecipe = async (userId, recipeId) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  let item = await RecipeLike.findOne({ userId, recipeId });
  if (!item) {
    item = await RecipeLike.create({ userId, recipeId });
  }
  return item;
};

const dislikeRecipe = async (userId, recipeId) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  const item = await RecipeLike.findOne({ userId, recipeId });
  if (item) {
    await item.remove();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe like not found');
  }
  return item;
};

const markCook = async (userId, recipeId) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  let item = await RecipeCook.findOne({ userId, recipeId });
  if (!item) {
    item = await RecipeCook.create({ userId, recipeId });
  }
  return item;
};

const unmarkCook = async (userId, recipeId) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  const item = await RecipeCook.findOne({ userId, recipeId });
  if (item) {
    await item.remove();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe cook not found');
  }
  return item;
};

const vote = async (userId, recipeId, point) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  let item = await Rating.findOne({ userId, recipeId });
  if (!item) {
    item = await Rating.create({ userId, recipeId, point });
  } else {
    Object.assign(item, { point });
    await item.save();
  }
  return item;
};

const unvote = async (userId, recipeId) => {
  const recipe = await getById(recipeId);
  if (!recipe) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
  const item = await Rating.findOne({ userId, recipeId });
  if (item) {
    await item.remove();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recipe rating not found');
  }
  return item;
};

const search = async (text, options) => {
  const recipes = Recipe.aggregate([
    {
      $match: {
        $text: {
          $search: text,
        },
      },
    },
    { $addFields: { score: { $meta: 'textScore' } } },
    { $match: { score: { $gt: 0.5 } } },
    ...lookup,
  ]);
  const items = await Recipe.aggregatePaginate(recipes, options).then((result) => {
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

const getLikedUsers = async (id) => {
  const items = await Recipe.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookupLikedUsers]);
  return items.at(0);
};

const getCookedUsers = async (id) => {
  const items = await Recipe.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookupCookedUsers]);
  return items.at(0);
};

const getRatingUsers = async (id) => {
  const items = await Recipe.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookupRatingUsers]);
  return items.at(0);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  likeRecipe,
  dislikeRecipe,
  markCook,
  unmarkCook,
  vote,
  unvote,
  search,
  getLikedUsers,
  getCookedUsers,
  getRatingUsers,
};
