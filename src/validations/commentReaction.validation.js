const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getItems = {
  query: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getItems,
};
