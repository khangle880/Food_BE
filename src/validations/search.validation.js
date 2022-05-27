const Joi = require('joi');

const search = {
  query: Joi.object().keys({
    q: Joi.string().required(),
    type: Joi.string().valid('RECIPE', 'POST', 'USER', 'PRODUCT', 'ALL').required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  search,
};
