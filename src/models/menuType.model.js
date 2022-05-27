const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const menuTypeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
menuTypeSchema.plugin(toJSON);
menuTypeSchema.plugin(paginate);

/**
 * @typedef MenuType
 */
const MenuType = mongoose.model('MenuType', menuTypeSchema);

module.exports = MenuType;
