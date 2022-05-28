const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productTypeSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productTypeSchema.plugin(toJSON);
productTypeSchema.plugin(paginate);

/**
 * @typedef ProductType
 */
const ProductType = mongoose.model('ProductType', productTypeSchema);

module.exports = ProductType;
