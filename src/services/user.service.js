const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const create = async (body) => {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(body);
};

const query = async (filter, options) => {
  const items = await User.paginate(filter, options);
  return items;
};

const getById = async (id) => {
  return User.findById(id);
};

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const updateById = async (userId, updateBody) => {
  const user = await getById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteById = async (id) => {
  const item = await getById(id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await item.remove();
  return item;
};

const follow = async (userId, otherUserId) => {
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user not exist');
  }
  const item = await User.findOne({ _id: userId, followingUsers: otherUserId });
  if (!item) {
    item.followingUsers.push(otherUserId);
    await item.save();
    otherUser.followerUsers.push(userId);
    await otherUser.save();
  }
  return item;
};

const unFollow = async (userId, otherUserId) => {
  const otherUser = await getById(userId);
  if (!otherUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user not exist');
  }
  const item = await User.findOne({ _id: userId, followingUsers: otherUserId });
  if (!item) {
    item.followingUsers.filter((id) => id !== otherUserId);
    await item.save();
    otherUser.followerUsers.filter((id) => id !== userId);
    await otherUser.save();
  }
  return item;
};

const changePassword = async (user, body) => {
  if (user.isPasswordMatch(body.oldPassword)) {
    Object.assign(user, { password: body.newPassword });
    await user.save();
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password Incorrect');
  }
  return user;
};

const search = async (text, options) => {
  return query({ $text: { $search: text } }, options);
};

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  getByEmail,
  query,
  follow,
  unFollow,
  changePassword,
  search,
};
