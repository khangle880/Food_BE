const Joi = require('joi');
const { objectId } = require('./custom.validation');

const cookStep = Joi.object().keys({
  content: Joi.string().required(),
  photoUrls: Joi.array().items(Joi.string()),
});

const ingredient = Joi.object().keys({
  name: Joi.string().required(),
  typeId: Joi.string().required().custom(objectId),
  unitId: Joi.string().required().custom(objectId),
  quantity: Joi.number().required(),
});

const create = {
  body: Joi.object()
    .keys({
      description: Joi.string().required(),
      name: Joi.string().required(),
      photoUrls: Joi.array().items(Joi.string()),
      servings: Joi.number().required(),
      steps: Joi.array().items(cookStep).required(),
      totalTime: Joi.number().required(),
      level: Joi.string().required().valid('EAZY', 'MEDIUM', 'HARD'),
      videoUrl: Joi.string(),
      videoThumbnail: Joi.string(),
      ingredients: Joi.array().items(ingredient).required(),
      specialGoals: Joi.array().items(Joi.string().custom(objectId)),
      menuTypes: Joi.array().items(Joi.string().custom(objectId)),
      cuisineId: Joi.string().custom(objectId),
      dishTypeId: Joi.string().custom(objectId),
      cookMethodId: Joi.string().custom(objectId),
    })
    .or('photoUrls', 'videoUrl'),
};

const getItems = {
  query: Joi.object().keys({
    name: Joi.string(),
    servings: Joi.number(),
    level: Joi.string().valid('EAZY', 'MEDIUM', 'HARD'),
    specialGoals: Joi.array().items(Joi.string().custom(objectId)),
    menuTypes: Joi.array().items(Joi.string().custom(objectId)),
    cuisineId: Joi.string().custom(objectId),
    dishTypeId: Joi.string().custom(objectId),
    cookMethodId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const like = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const dislike = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const markCook = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const unmarkCook = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const vote = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({ point: Joi.number().required() }),
};

const unvote = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const deleteRating = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      name: Joi.string(),
      photoUrls: Joi.array().items(Joi.string()),
      servings: Joi.number(),
      steps: Joi.array().items(cookStep),
      totalTime: Joi.number(),
      level: Joi.string().valid('EAZY', 'MEDIUM', 'HARD'),
      videoUrl: Joi.string(),
      videoThumbnail: Joi.string(),
      ingredients: Joi.array().items(ingredient),
      specialGoals: Joi.array().items(Joi.string().custom(objectId)),
      menuTypes: Joi.array().items(Joi.string().custom(objectId)),
      cuisineId: Joi.string().custom(objectId),
      dishTypeId: Joi.string().custom(objectId),
      cookMethodId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getLikedUsers = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCookedUsers = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRatingUsers = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
  like,
  dislike,
  markCook,
  unmarkCook,
  vote,
  unvote,
  deleteRating,
  getLikedUsers,
  getCookedUsers,
  getRatingUsers,
};
