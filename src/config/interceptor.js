const METHOD = {
  GET: 'get',
  POST: 'post',
};

const interceptor = (url, method, data, contentType = 'application/json') => {
  return {
    method,
    url,
    data,
    headers: {
      'Content-Type': contentType,
    },
  };
};

module.exports = { interceptor, METHOD };
