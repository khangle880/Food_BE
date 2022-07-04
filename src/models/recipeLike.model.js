const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON } = require('./plugins');

const recipeLikeSchema = mongoose.Schema(
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
  },
  { timestamps: true }
);

recipeLikeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// add plugin that converts mongoose to json
recipeLikeSchema.plugin(toJSON);
recipeLikeSchema.plugin(aggregatePaginate);

/**
 * @typedef RecipeLike
 */
const RecipeLike = mongoose.model('RecipeLike', recipeLikeSchema);

module.exports = RecipeLike;
