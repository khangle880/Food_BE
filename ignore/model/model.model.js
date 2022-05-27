// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

// const modelSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     chatbotId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Chatbot',
//       required: true,
//     },
//     schema: {
//       type: Object,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// modelSchema.index({ name: 1, chatbotId: 1 }, { unique: true });

// // add plugin that converts mongoose to json
// modelSchema.plugin(toJSON);
// modelSchema.plugin(paginate);

// modelSchema.statics.isNameTaken = async function (name, chatbotId, excludeModelId) {
//   const chatbot = await this.findOne({ name, chatbotId, _id: { $ne: excludeModelId } });
//   return !!chatbot;
// };

// /**
//  * @typedef Model
//  */
// const Model = mongoose.model('Model', modelSchema);

// module.exports = Model;
