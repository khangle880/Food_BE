const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recipeLikeRecipe = mongoose.Schema(
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

recipeLikeRecipe.index({ userId: 1, recipeId: 1 }, { unique: true });

// add plugin that converts mongoose to json
recipeLikeRecipe.plugin(toJSON);
recipeLikeRecipe.plugin(paginate);

/**
 * @typedef RecipeLike
 */
const RecipeLike = mongoose.model('RecipeLike', recipeLikeRecipe);

module.exports = RecipeLike;
