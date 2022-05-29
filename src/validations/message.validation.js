const Joi = require('joi');

const sendMessage = {
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
};

module.exports = {
  sendMessage,
};
