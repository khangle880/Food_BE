const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const postReactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

postReactionSchema.index({ userId: 1, postId: 1 }, { unique: true });

// add plugin that converts mongoose to json
postReactionSchema.plugin(toJSON);
postReactionSchema.plugin(paginate);
postReactionSchema.plugin(aggregatePaginate);

/**
 * @typedef PostReaction
 */
const PostReaction = mongoose.model('PostReaction', postReactionSchema);

module.exports = PostReaction;
