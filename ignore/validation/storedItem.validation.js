const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    modelId: Joi.custom(objectId).required(),
    data: Joi.object().required(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    modelId: Joi.custom(objectId).required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
  body: Joi.object().keys({
    data: Joi.object(),
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
      modelId: Joi.custom(objectId),
      data: Joi.object(),
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
  getById,
  updateById,
  deleteById,
};
