const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { interceptor, METHOD } = require('../config/interceptor');
const config = require('../config/config');

const getMessage = async (language, message, senderId) => {
  const interceptorConfig = interceptor(language === 'EN' ? config.rasa_en_url : config.rasa_vn_url, METHOD.POST, {
    message,
    senderId,
  });

  const data = await axios(interceptorConfig)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw new ApiError(httpStatus.BAD_GATEWAY, error);
    });

  return data;
};

module.exports = {
  getMessage,
};
