const httpStatus = require('http-status');
const { Action } = require('../../src/models');
const ApiError = require('../../src/utils/ApiError');

const handleMongooseError = (err) => {
  if (err) {
    if (err.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Action name already taken');
    }
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  }
};

const create = async (itemBody) => {
  return Action.create(itemBody).catch(handleMongooseError);
};

const query = async (filter) => {
  const items = await Action.find(filter);
  return items;
};

const getById = async (id) => {
  return Action.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
  }
  Object.assign(item, updateBody);
  await item.save().catch(handleMongooseError);
  return item;
};

const deleteById = async (itemId) => {
  const item = await getById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
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
