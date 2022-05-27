const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { modelService } = require('../services');

const create = catchAsync(async (req, res) => {
  const model = await modelService.create(req.body);
  res.status(httpStatus.CREATED).send(model);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'chatbotId']);
  const result = await modelService.query(filter);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const model = await modelService.getById(req.params.id);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  res.send(model);
});

const updateById = catchAsync(async (req, res) => {
  const model = await modelService.updateById(req.params.id, req.body);
  res.send(model);
});

const deleteById = catchAsync(async (req, res) => {
  await modelService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
};
