// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('../plugins');

// const calledActionSchema = mongoose.Schema(
//   {
//     index: {
//       type: Number,
//       required: true,
//       unique: true,
//       validate: {
//         validator: Number.isInteger,
//         message: '{VALUE} is not an integer value',
//       },
//     },
//     intentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'TrainingItem',
//       required: true,
//     },
//     actionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Action',
//       required: true,
//     },
//     inputs: {
//       type: [{ type: String }],
//       default: [],
//     },
//     outputMapNames: {
//       type: Array,
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// calledActionSchema.index({ index: 1, intentId: 1 }, { unique: true });

// // add plugin that converts mongoose to json
// calledActionSchema.plugin(toJSON);
// calledActionSchema.plugin(paginate);

// /**
//  * @typedef CalledAction
//  */
// const CalledAction = mongoose.model('CalledAction', calledActionSchema);

// module.exports = CalledAction;
