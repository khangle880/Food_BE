const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  return Product.create(body);
};

const query = async (filter, options) => {
  const items = await Product.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return Product.findById(id);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await item.remove();
  return item;
};

const search = async (text, options) => {
  return query({ $text: { $search: text } }, options);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  search,
};
