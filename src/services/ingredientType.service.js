const httpStatus = require('http-status');
const { IngredientType } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  return IngredientType.create(body);
};

const query = async (filter, options) => {
  const items = await IngredientType.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return IngredientType.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient type not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ingredient type not found');
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
