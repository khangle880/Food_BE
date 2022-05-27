const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recipeCookSchema = mongoose.Schema(
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

recipeCookSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// add plugin that converts mongoose to json
recipeCookSchema.plugin(toJSON);
recipeCookSchema.plugin(paginate);

/**
 * @typedef RecipeCook
 */
const RecipeCook = mongoose.model('RecipeCook', recipeCookSchema);

module.exports = RecipeCook;
