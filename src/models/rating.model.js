const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const ratingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe',
    },
    point: { type: Number, required: true },
  },
  { timestamps: true }
);

ratingSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// add plugin that converts mongoose to json
ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);
ratingSchema.plugin(aggregatePaginate);

/**
 * @typedef Rating
 */
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
