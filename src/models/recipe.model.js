const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const recipeSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    deletedAt: { type: Date, transform: (v) => (v == null ? '' : v) },
    description: { type: String, required: true },
    name: { type: String, required: true },
    photoUrls: {
      type: [{ type: String }],
      default: [],
    },
    servings: {
      type: Number,
      required: true,
    },
    steps: {
      type: [{ content: { type: String, required: true }, photoUrls: { type: [{ type: String }] } }],
      required: true,
    },
    level: {
      type: String,
      enum: {
        values: ['EAZY', 'MEDIUM', 'HARD'],
        message: "Level includes: 'EAZY', 'MEDIUM', 'HARD'",
      },
      required: true,
    },
    ingredients: {
      type: [
        {
          name: { type: String, required: true },
          typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'IngredientType', required: true },
          unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    specialGoals: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SpecialGoal' }], default: [] },
    totalView: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
      default: 0,
    },
    totalTime: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
      required: true,
    },
    menuTypes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuType' }],
      required: true,
    },
    videoUrl: { type: String, transform: (v) => (v == null ? '' : v) },
    videoThumbnail: { type: String, transform: (v) => (v == null ? '' : v) },
    cuisineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuisine', required: true },
    dishTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DishType', required: true },
    cookMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'CookMethod', required: true },
  },
  { timestamps: true }
);
recipeSchema.index({
  description: 'text',
  name: 'text',
  servings: 'text',
  totalTime: 'text',
  level: 'text',
});

// add plugin that converts mongoose to json
recipeSchema.plugin(toJSON);
recipeSchema.plugin(paginate);
recipeSchema.plugin(aggregatePaginate);

/**
 * @typedef Recipe
 */
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
