const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const specialGoalSchema = mongoose.Schema(
  {
    names: { type: [{ type: String }], required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
specialGoalSchema.plugin(toJSON);
specialGoalSchema.plugin(paginate);

/**
 * @typedef SpecialGoal
 */
const SpecialGoal = mongoose.model('SpecialGoal', specialGoalSchema);

module.exports = SpecialGoal;
