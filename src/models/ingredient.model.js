const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ingredientSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
ingredientSchema.plugin(toJSON);
ingredientSchema.plugin(paginate);

/**
 * @typedef Ingredient
 */
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
