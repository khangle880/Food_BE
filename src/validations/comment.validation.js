const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object()
    .keys({
      postId: Joi.string().required().custom(objectId),
      parentId: Joi.string().custom(objectId),
      photoUrls: Joi.array().items(Joi.string()),
      videoUrl: Joi.string(),
      content: Joi.string(),
    })
    .or('content', 'photoUrls', 'videoUrl'),
};

const getItems = {
  query: Joi.object().keys({
    postId: Joi.string().custom(objectId),
    parentId: Joi.string().custom(objectId),
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

const react = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.string().required(),
  }),
};

const deleteReaction = {
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
      photoUrls: Joi.array().items(Joi.string()),
      videoUrl: Joi.string(),
      content: Joi.string(),
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
  react,
  deleteReaction,
};
