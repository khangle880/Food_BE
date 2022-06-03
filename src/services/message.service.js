const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { interceptor, METHOD } = require('../config/interceptor');
const config = require('../config/config');

const getMessage = async (languageSetting, message, senderId) => {
  const interceptorConfig = interceptor(languageSetting === 'EN' ? config.rasa_en_url : config.rasa_vn_url, METHOD.POST, {
    message,
    senderId,
  });

  const responseData = await axios(interceptorConfig)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw new ApiError(httpStatus.BAD_GATEWAY, error);
    });

  Object.keys(responseData.data).forEach(function (key) {
    responseData.data[key].sender = 'chatbot';
  });

  return responseData;
};

module.exports = {
  getMessage,
};
