const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { interceptor, METHOD } = require('../config/interceptor');
const AppConfig = require('../models/appConfig.model');

const getMessage = async (languageSetting, message, senderId) => {
  const appConfig = await AppConfig.findById('62c2640c1eb3cffe134510d0');

  const interceptorConfig = interceptor(appConfig.ngrokUrl, METHOD.POST, {
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
