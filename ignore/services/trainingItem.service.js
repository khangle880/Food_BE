const httpStatus = require('http-status');
const { TrainingItem } = require('../models');
const ApiError = require('../utils/ApiError');

const handleMongooseError = (err) => {
  if (err) {
    if (err.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Training item name already taken');
    }
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
};

const create = async (itemBody) => {
  return TrainingItem.create(itemBody).catch(handleMongooseError);
};

const query = async (filter) => {
  const items = await TrainingItem.find(filter);
  return items;
};

const getById = async (id) => {
  return TrainingItem.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Training item not found');
  }
  Object.assign(item, updateBody);
  await item.save().catch(handleMongooseError);
  return item;
};

const deleteById = async (itemId) => {
  const item = await getById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Training item not found');
  }
  await item.remove();
  return item;
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
};
