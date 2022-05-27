const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { chatbotService } = require('../services');

const create = catchAsync(async (req, res) => {
  req.body.creatorId = req.user.id;
  const chatbot = await chatbotService.create(req.body);
  res.status(httpStatus.CREATED).send(chatbot);
});

const getMyItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'isActive', 'isPrivate']);
  filter.creatorId = req.user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await chatbotService.query(filter, options);
  res.send(result);
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'creatorId', 'isActive', 'isPrivate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await chatbotService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const chatbot = await chatbotService.getById(req.params.id);
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  res.send(chatbot);
});

const updateById = catchAsync(async (req, res) => {
  const chatbot = await chatbotService.updateById(req.params.id, req.body);
  res.send(chatbot);
});

const deleteById = catchAsync(async (req, res) => {
  await chatbotService.deleteById(req.params.id);
  res.status(httpStatus.OK).send('Delete Successfully');
});

module.exports = {
  create,
  getItems,
  getMyItems,
  getById,
  updateById,
  deleteById,
};
