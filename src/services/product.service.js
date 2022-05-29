const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const lookup = [
  {
    $lookup: {
      from: 'producttypes',
      localField: 'productTypeId',
      foreignField: '_id',
      as: 'productType',
    },
  },
  { $unwind: { path: '$productType', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'users',
      localField: 'creatorId',
      foreignField: '_id',
      as: 'creator',
    },
  },
  { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },
  {
    $addFields: {
      'creator.id': '$creator._id',
      'productType.id': '$productType._id',
      id: '$_id',
    },
  },
  {
    $project: {
      'creator._id': 0,
      'creator.__v': 0,
      'creator.password': 0,
      'creator.createdAt': 0,
      'creator.updatedAt': 0,
      'productType._id': 0,
      'productType.__v': 0,
      'productType.createdAt': 0,
      'productType.updatedAt': 0,
      creatorId: 0,
      productTypeId: 0,
      _id: 0,
      __v: 0,
    },
  },
];
const create = async (creatorId, body) => {
  return Product.create({ creatorId, ...body });
};

const query = async (filter, options) => {
  const products = Product.aggregate([...lookup, { $match: filter }]);
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

const getById = async (id) => {
  const items = await Product.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }, ...lookup]).limit(1);
  return items.at(0);
};

const updateById = async (id, updateBody) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(item, updateBody);
  await Product.updateOne({ _id: item.id }, { $set: updateBody });
  return getById(id);
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
    ...lookup,
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
