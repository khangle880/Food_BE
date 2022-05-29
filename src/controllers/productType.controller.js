const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productTypeService } = require('../services');

const create = catchAsync(async (req, res) => {
  const item = await productTypeService.create(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['names']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productTypeService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const item = await productTypeService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product type not found');
  }
  res.send(item);
});

const updateById = catchAsync(async (req, res) => {
  const item = await productTypeService.updateById(req.params.id, req.body);
  res.send(item);
});

const deleteById = catchAsync(async (req, res) => {
  await productTypeService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
};
