const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object()
    .keys({
      productTypeId: Joi.string().required().custom(objectId),
      photoUrls: Joi.array().items(Joi.string()),
      videoUrl: Joi.string(),
      description: Joi.string().required(),
      price: Joi.number(),
      unitId: Joi.string().custom(objectId),
      saleLocations: Joi.array().items(Joi.string()),
    })
    .or('photoUrls', 'videoUrl'),
};

const getItems = {
  query: Joi.object().keys({
    productTypeId: Joi.string().custom(objectId),
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
      productTypeId: Joi.string().custom(objectId),
      photoUrls: Joi.array().items(Joi.string()),
      videoUrl: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      unitId: Joi.string().custom(objectId),
      saleLocations: Joi.array().items(Joi.string()),
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
