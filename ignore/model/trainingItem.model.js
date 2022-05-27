// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('../plugins');

// const traningItemSchema = mongoose.Schema(
//   {
//     chatbotId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Chatbot',
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: {
//         values: ['INTENT', 'SYNONYM', 'ENTITY_LOOKUP', 'ENTITY_REGEX'],
//         message: "type includes: 'INTENT', 'SYNONYM', 'ENTITY_LOOKUP', 'ENTITY_REGEX'",
//       },
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     examples: {
//       type: Array,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// traningItemSchema.index({ type: 1, chatbotId: 1, name: 1 }, { unique: true });

// // add plugin that converts mongoose to json
// traningItemSchema.plugin(toJSON);
// traningItemSchema.plugin(paginate);

// traningItemSchema.statics.isItemTaken = async function (chatbotId, type, name, excludeItemId) {
//   const result = await this.findOne({ chatbotId, type, name, _id: { $ne: excludeItemId } });
//   return !!result;
// };

// /**
//  * @typedef TrainingItem
//  */
// const TrainingItem = mongoose.model('TrainingItem', traningItemSchema);

// module.exports = TrainingItem;
