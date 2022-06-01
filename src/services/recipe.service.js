const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Recipe, RecipeLike, RecipeCook, Rating } = require('../models');
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
    },
  },
  {
    $project: {
      'creator._id': 0,
      'creator.__v': 0,
      'creator.password': 0,
      'creator.createdAt': 0,
      'creator.updatedAt': 0,
    },
  },
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
  { $unwind: { path: '$specialGoals', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'specialGoals.id': '$specialGoals._id',
    },
  },
  {
    $project: {
      'specialGoals.__v': 0,
      'specialGoals._id': 0,
      'specialGoals.createdAt': 0,
      'specialGoals.updatedAt': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      specialGoals: {
        $push: '$specialGoals',
      },
      doc: { $first: '$$ROOT' },
    },
  },
  { $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { specialGoals: '$specialGoals' }] } } },
  {
    $lookup: {
      from: 'menutypes',
      localField: 'menuTypes',
      foreignField: '_id',
      as: 'menuTypes',
    },
  },
  { $unwind: { path: '$menuTypes', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'menuTypes.id': '$menuTypes._id',
    },
  },
  {
    $project: {
      'menuTypes.__v': 0,
      'menuTypes._id': 0,
      'menuTypes.createdAt': 0,
      'menuTypes.updatedAt': 0,
    },
  },
  {
    $group: {
      _id: '$_id',
      menuTypes: {
        $push: '$menuTypes',
      },
      doc: { $first: '$$ROOT' },
    },
  },
  { $replaceRoot: { newRoot: { $mergeObjects: ['$doc', { menuTypes: '$menuTypes' }] } } },
  {
    $lookup: {
      from: 'cuisines',
      localField: 'cuisineId',
      foreignField: '_id',
      as: 'cuisine',
    },
  },
  { $unwind: { path: '$cuisine', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'cuisine.id': '$cuisine._id',
    },
  },
  {
    $project: {
      'cuisine._id': 0,
      'cuisine.__v': 0,
      'cuisine.createdAt': 0,
      'cuisine.updatedAt': 0,
    },
  },
  {
    $lookup: {
      from: 'dishtypes',
      localField: 'dishTypeId',
      foreignField: '_id',
      as: 'dishType',
    },
  },
  { $unwind: { path: '$dishType', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'dishType.id': '$dishType._id',
    },
  },
  {
    $project: {
      'dishType._id': 0,
      'dishType.__v': 0,
      'dishType.createdAt': 0,
      'dishType.updatedAt': 0,
    },
  },
  {
    $lookup: {
      from: 'cookmethods',
      localField: 'cookMethodId',
      foreignField: '_id',
      as: 'cookMethod',
    },
  },
  { $unwind: { path: '$cookMethod', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'cookMethod.id': '$cookMethod._id',
    },
  },
  {
    $project: {
      'cookMethod._id': 0,
      'cookMethod.__v': 0,
      'cookMethod.createdAt': 0,
      'cookMethod.updatedAt': 0,
    },
  },
  { $unwind: { path: '$ingredients', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'ingredients',
      localField: 'ingredients.ingredientId',
      foreignField: '_id',
      as: 'ingredients.ingredient',
    },
  },
  {
    $unwind: { path: '$ingredients.ingredient', preserveNullAndEmptyArrays: true },
  },
  {
    $lookup: {
      from: 'units',
      localField: 'ingredients.unitId',
      foreignField: '_id',
      as: 'ingredients.unit',
    },
  },
  {
    $unwind: { path: '$ingredients.unit', preserveNullAndEmptyArrays: true },
  },
  {
    $addFields: {
      'ingredients.ingredient.id': '$ingredients.ingredient._id',
      'ingredients.unit.id': '$ingredients.unit._id',
    },
  },
  {
    $project: {
      'ingredients.ingredientId': 0,
      'ingredients.unitId': 0,
      'ingredients._id': 0,
      'ingredients.ingredient.__v': 0,
      'ingredients.ingredient._id': 0,
      'ingredients.ingredient.createdAt': 0,
      'ingredients.ingredient.updatedAt': 0,
      'ingredients.unit.__v': 0,
      'ingredients.unit._id': 0,
      'ingredients.unit.createdAt': 0,
      'ingredients.unit.updatedAt': 0,
    },
  },
  {
    $addFields: {
      ingredients: {
        $arrayToObject: {
          $filter: {
            input: { $objectToArray: '$ingredients' },
            cond: { $not: { $in: ['$$this.v', [null, '', {}]] } },
          },
        },
      },
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
    $project: {
      _id: 0,
      __v: 0,
      likedUsers: 0,
      cookedUsers: 0,
      ratings: 0,
      creatorId: 0,
      cuisineId: 0,
      dishTypeI: 0,
      cookMethodId: 0,
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

const lookupLikedUsers = [
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
    },
  },
  {
    $project: {
      'user.__v': 0,
      'user._id': 0,
      'user.password': 0,
      'user.createdAt': 0,
      'user.updatedAt': 0,
    },
  },
  { $replaceRoot: { newRoot: '$user' } },
];

const lookupCookedUsers = [
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
    },
  },
  {
    $project: {
      'user.__v': 0,
      'user._id': 0,
      'user.password': 0,
      'user.createdAt': 0,
      'user.updatedAt': 0,
    },
  },
  { $replaceRoot: { newRoot: '$user' } },
];

const lookupRatingUsers = [
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
      point: 1,
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

const getLikedUsers = async (id, options) => {
  const users = RecipeLike.aggregate([{ $match: { recipeId: mongoose.Types.ObjectId(id) } }, ...lookupLikedUsers]);
  const items = await RecipeLike.aggregatePaginate(users, options).then((result) => {
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

const getCookedUsers = async (id, options) => {
  const users = RecipeCook.aggregate([{ $match: { recipeId: mongoose.Types.ObjectId(id) } }, ...lookupCookedUsers]);
  const items = await RecipeCook.aggregatePaginate(users, options).then((result) => {
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

const getRatingUsers = async (id, options) => {
  const ratings = Rating.aggregate([{ $match: { recipeId: mongoose.Types.ObjectId(id) } }, ...lookupRatingUsers]);
  const items = await Rating.aggregatePaginate(ratings, options).then((result) => {
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
