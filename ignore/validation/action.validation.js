const Joi = require('joi');
const { objectId } = require('../../src/validations/custom.validation');

const variable = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
});

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    inputs: Joi.array().items(variable).required(),
    outputs: Joi.array().items(variable).required(),
  }),
};

const getItems = {
  query: Joi.object().keys({
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
      name: Joi.string(),
      inputs: Joi.array().items(variable),
      outputs: Joi.array().items(variable),
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
