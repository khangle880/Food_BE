// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

// const chatbotSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     creatorId: {
//       type: String,
//       required: true,
//     },
//     isPrivate: {
//       type: Boolean,
//       required: true,
//       default: true,
//     },
//     isActive: {
//       type: Boolean,
//       required: true,
//       default: true,
//     },
//     slots: {
//       type: Object,
//       default: {},
//     },
//     configs: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );
// // TODO: add is_deleted

// // add plugin that converts mongoose to json
// chatbotSchema.plugin(toJSON);
// chatbotSchema.plugin(paginate);

// /**
//  * Check if chatbot is taken
//  * @param {string} name - The chatbot's name
//  * @param {ObjectId} [excludeChatbotId] - The id of the chatbot to be excluded
//  * @returns {Promise<boolean>}
//  */
// chatbotSchema.statics.isNameTaken = async function (name, excludeChatbotId) {
//   const chatbot = await this.findOne({ name, _id: { $ne: excludeChatbotId } });
//   return !!chatbot;
// };

// /**
//  * @typedef Chatbot
//  */
// const Chatbot = mongoose.model('Chatbot', chatbotSchema);

// module.exports = Chatbot;
