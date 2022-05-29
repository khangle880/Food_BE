const httpStatus = require('http-status');
const { DishType } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  return DishType.create(body);
};

const query = async (filter, options) => {
  const items = await DishType.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return DishType.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dish type not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dish type not found');
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
