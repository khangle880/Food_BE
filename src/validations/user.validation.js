const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().valid('user', 'admin'),
  }),
};

const getItems = {
  query: Joi.object().keys({
    role: Joi.string(),
    name: Joi.string(),
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

const updateById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      bio: Joi.string(),
      avatarUrl: Joi.string(),
      phone: Joi.string(),
      gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
    })
    .min(1),
};

const deleteById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const follow = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const unFollow = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getLikedRecipes = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRecipes = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
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
  follow,
  unFollow,
  getLikedRecipes,
  getRecipes,
};
