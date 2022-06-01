const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const commentReactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    commentId: {
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

commentReactionSchema.index({ userId: 1, commentId: 1 }, { unique: true });

// add plugin that converts mongoose to json
commentReactionSchema.plugin(toJSON);
commentReactionSchema.plugin(paginate);
commentReactionSchema.plugin(aggregatePaginate);

/**
 * @typedef CommentReaction
 */
const CommentReaction = mongoose.model('CommentReaction', commentReactionSchema);

module.exports = CommentReaction;
