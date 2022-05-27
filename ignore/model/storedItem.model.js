// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('../plugins');

// const storedItemSchema = mongoose.Schema(
//   {
//     modelId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Model',
//       required: true,
//     },
//     data: {
//       type: Object,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // add plugin that converts mongoose to json
// storedItemSchema.plugin(toJSON);
// storedItemSchema.plugin(paginate);

// /**
//  * @typedef StoredItem
//  */
// const StoredItem = mongoose.model('StoredItem', storedItemSchema);

// module.exports = StoredItem;
