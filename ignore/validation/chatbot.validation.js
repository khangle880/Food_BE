const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    isActive: Joi.boolean(),
    isPrivate: Joi.boolean(),
    slots: Joi.object(),
    configs: Joi.object(),
  }),
};

const getMyItems = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.boolean(),
    isPrivate: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getItems = {
  query: Joi.object().keys({
    name: Joi.string(),
    creatorId: Joi.string(),
    isActive: Joi.boolean(),
    isPrivate: Joi.boolean(),
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
      name: Joi.string(),
      creatorId: Joi.custom(objectId),
      isActive: Joi.boolean(),
      isPrivate: Joi.boolean(),
      slots: Joi.object(),
      configs: Joi.object(),
    })
    .min(1),
};

const deleteById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  create,
  getItems,
  getMyItems,
  getById,
  updateById,
  deleteById,
};
