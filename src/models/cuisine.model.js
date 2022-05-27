const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cuisineSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
cuisineSchema.plugin(toJSON);
cuisineSchema.plugin(paginate);

/**
 * @typedef Cuisine
 */
const Cuisine = mongoose.model('Cuisine', cuisineSchema);

module.exports = Cuisine;
