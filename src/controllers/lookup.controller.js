const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { SpecialGoal, Cuisine, DishType, IngredientType, ProductType, Unit, CookMethod } = require('../models');
const MenuType = require('../models/menuType.model');

const getAll = catchAsync(async (req, res) => {
  const result = {};
  result.goals = await SpecialGoal.find();
  result.menuTypes = await MenuType.find();
  result.cuisines = await Cuisine.find();
  result.dishTypes = await DishType.find();
  result.ingredientTypes = await IngredientType.find();
  result.productTypes = await ProductType.find();
  result.units = await Unit.find();
  result.cookMethods = await CookMethod.find();
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getAll,
};
