const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ingredientTypeSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
ingredientTypeSchema.plugin(toJSON);
ingredientTypeSchema.plugin(paginate);

/**
 * @typedef IngredientType
 */
const IngredientType = mongoose.model('IngredientType', ingredientTypeSchema);

module.exports = IngredientType;
