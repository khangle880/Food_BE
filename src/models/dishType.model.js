const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dishTypeSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
dishTypeSchema.plugin(toJSON);
dishTypeSchema.plugin(paginate);

/**
 * @typedef DishType
 */
const DishType = mongoose.model('DishType', dishTypeSchema);

module.exports = DishType;
