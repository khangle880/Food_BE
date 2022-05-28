const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const commentSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      transform: (v) => (v == null ? '' : v),
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    photoUrls: {
      type: [{ type: String }],
      default: [],
    },
    videoUrl: { type: String, transform: (v) => (v == null ? '' : v) },
    content: { type: String, transform: (v) => (v == null ? '' : v) },
    deletedAt: { type: Date, transform: (v) => (v == null ? '' : v) },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
