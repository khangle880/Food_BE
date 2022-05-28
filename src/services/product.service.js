const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (creatorId, body) => {
  return Product.create({ creatorId, ...body });
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
  const products = Product.aggregate([
    {
      $match: {
        $text: {
          $search: text,
        },
      },
    },
    { $addFields: { score: { $meta: 'textScore' }, id: '$_id' } },
    { $match: { score: { $gt: 0.5 } } },
    {
      $project: {
        __v: 0,
        _id: 0,
      },
    },
  ]);
  const items = await Product.aggregatePaginate(products, options).then((result) => {
    const value = {};
    value.results = result.docs;
    value.page = result.page;
    value.limit = result.limit;
    value.totalPages = result.totalPages;
    value.totalResults = result.totalDocs;
    return value;
  });
  return items;
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  query,
  search,
};
