const Joi = require('joi');
const { objectId } = require('../../src/validations/custom.validation');

const create = {
  body: Joi.object().keys({
    index: Joi.number().integer().required(),
    intentId: Joi.required().custom(objectId),
    actionId: Joi.required().custom(objectId),
    inputs: Joi.array().items(Joi.string()),
    outputMapNames: Joi.object(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    intentId: Joi.custom(objectId).required(),
    index: Joi.number().integer(),
    actionId: Joi.custom(objectId),
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
      index: Joi.number().integer(),
      intentId: Joi.custom(objectId),
      actionId: Joi.custom(objectId),
      inputs: Joi.array().items(Joi.string()),
      outputMapNames: Joi.object(),
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
