const httpStatus = require('http-status');
const pick = require('../../src/utils/pick');
const ApiError = require('../../src/utils/ApiError');
const catchAsync = require('../../src/utils/catchAsync');
const { actionService } = require('../../src/services');

const create = catchAsync(async (req, res) => {
  const item = await actionService.create(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await actionService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const item = await actionService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
  }
  res.send(item);
});

const updateById = catchAsync(async (req, res) => {
  const item = await actionService.updateById(req.params.id, req.body);
  res.send(item);
});

const deleteById = catchAsync(async (req, res) => {
  await actionService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

module.exports = {
  create,
  getItems,
  getById,
  updateById,
  deleteById,
};
