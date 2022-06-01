const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cookMethodSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
cookMethodSchema.plugin(toJSON);
cookMethodSchema.plugin(paginate);

/**
 * @typedef CookMethod
 */
const CookMethod = mongoose.model('CookMethod', cookMethodSchema);

module.exports = CookMethod;
