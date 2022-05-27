const httpStatus = require('http-status');
const { StoredItem } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (itemBody) => {
  return StoredItem.create(itemBody);
};

const query = async (filter, options) => {
  const items = await StoredItem.paginate(filter, options);
  return items;
};

const getItems = async (id) => {
  return StoredItem.findById(id);
};

const getById = async (id, updateBody) => {
  const item = await getItems(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stored item not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (dataId) => {
  const item = await getItems(dataId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'StoredItem not found');
  }
  await item.remove();
  return item;
};

module.exports = {
  create,
  getItems,
  getById,
  deleteById,
  query,
};
