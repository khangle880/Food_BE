// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

// const variableSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
// });

// const actionSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     inputs: {
//       type: [variableSchema],
//       required: true,
//     },
//     outputs: {
//       type: [variableSchema],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// actionSchema.index({ name: 1 }, { unique: true });

// // add plugin that converts mongoose to json
// actionSchema.plugin(toJSON);
// actionSchema.plugin(paginate);

// /**
//  * @typedef Action
//  */
// const Action = mongoose.model('Action', actionSchema);

// module.exports = Action;
