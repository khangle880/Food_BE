const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const unitSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
unitSchema.plugin(toJSON);
unitSchema.plugin(paginate);

/**
 * @typedef Unit
 */
const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
