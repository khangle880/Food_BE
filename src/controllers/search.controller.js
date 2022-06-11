const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userService, recipeService, postService, productService } = require('../services');

const search = catchAsync(async (req, res) => {
  const result = {};
  const { type } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = req.query;
  delete filter.page;
  delete filter.limit;
  delete filter.sortBy;
  delete filter.type;
  if (type === 'RECIPE' || type === 'ALL') {
    result.recipes = await recipeService.search(req.user.id, filter, options);
  }
  if (type === 'USER' || type === 'ALL') {
    result.users = await userService.search(filter, options);
  }
  if (type === 'POST' || type === 'ALL') {
    result.posts = await postService.search(req.user.id, filter, options);
  }
  if (type === 'PRODUCT' || type === 'ALL') {
    result.products = await productService.search(filter, options);
  }
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  search,
};
