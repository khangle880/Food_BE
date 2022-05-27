const httpStatus = require('http-status');
const { Chatbot } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (chatbotBody) => {
  if (await Chatbot.isNameTaken(chatbotBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chatbot name already taken');
  }
  return Chatbot.create(chatbotBody);
};

const query = async (filter, options) => {
  const chatbots = await Chatbot.paginate(filter, options);
  return chatbots;
};

const getById = async (id) => {
  return Chatbot.findById(id);
};

const getByName = async (name) => {
  return Chatbot.findOne({ name });
};

const updateById = async (id, updateBody) => {
  const chatbot = await getById(id);
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  if (updateBody.name && (await Chatbot.isNameTaken(updateBody.name, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }
  Object.assign(chatbot, updateBody);
  await chatbot.save();
  return chatbot;
};

const deleteById = async (ChatbotId) => {
  const chatbot = await getById(ChatbotId);
  if (!chatbot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatbot not found');
  }
  await chatbot.remove();
  return chatbot;
};

module.exports = {
  create,
  getById,
  getByName,
  updateById,
  deleteById,
  query,
};
