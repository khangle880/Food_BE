const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userService, recipeService, postService, productService } = require('../services');

const search = catchAsync(async (req, res) => {
  const result = {};
  const { type } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (type === 'RECIPE' || type === 'ALL') {
    result.recipes = await recipeService.search(req.query.q, options);
  }
  if (type === 'USER' || type === 'ALL') {
    result.users = await userService.search(req.query.q, options);
  }
  if (type === 'POST' || type === 'ALL') {
    result.posts = await postService.search(req.query.q, options);
  }
  if (type === 'PRODUCT' || type === 'ALL') {
    result.products = await productService.search(req.query.q, options);
  }
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  search,
};
