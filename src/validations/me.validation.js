const Joi = require('joi');
const { password } = require('./custom.validation');

const updateMe = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
      bio: Joi.string(),
      avatarUrl: Joi.string(),
      phone: Joi.string(),
      gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
      languageSetting: Joi.string().valid('VN', 'EN'),
    })
    .min(1),
};

const changePassword = {
  body: Joi.object()
    .keys({
      oldPassword: Joi.string().custom(password),
      newPassword: Joi.string().custom(password),
    })
    .min(1),
};

module.exports = {
  updateMe,
  changePassword,
};
