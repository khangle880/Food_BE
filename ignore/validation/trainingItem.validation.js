const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    chatbotId: Joi.custom(objectId).required(),
    type: Joi.string().required(),
    name: Joi.string().required(),
    examples: Joi.array().required(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    chatbotId: Joi.custom(objectId).required(),
    type: Joi.string(),
    name: Joi.string(),
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
      chatbotId: Joi.custom(objectId),
      type: Joi.string(),
      name: Joi.string(),
      examples: Joi.array(),
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
