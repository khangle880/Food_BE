const httpStatus = require('http-status');
const { Model } = require('../models');
const ApiError = require('../utils/ApiError');

const handleMongooseError = (err) => {
  if (err) {
    if (err.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Model name already taken');
    }
    throw new ApiError(httpStatus.BAD_REQUEST);
  }
};

const create = async (modelBody) => {
  return Model.create(modelBody).catch(handleMongooseError);
};

const query = async (filter) => {
  const models = await Model.find(filter);
  return models;
};

const getById = async (id) => {
  return Model.findById(id);
};

const updateById = async (id, updateBody) => {
  const model = await getById(id);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  Object.assign(model, updateBody);
  await model.save().catch(handleMongooseError);
  return model;
};

const deleteById = async (modelId) => {
  const model = await getById(modelId);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  await model.remove();
  return model;
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
};
