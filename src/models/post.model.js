const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const postSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    photoUrls: {
      type: [{ type: String }],
      default: [],
    },
    videoUrl: { type: String, transform: (v) => (v == null ? '' : v) },
    viewRange: {
      type: String,
      enum: {
        values: ['PRIVATE', 'PUBLIC'],
        message: "Range includes: 'PRIVATE', 'PUBLIC'",
      },
      required: true,
    },
    backgroundColor: { type: String, transform: (v) => (v == null ? '' : v) },
    content: { type: String, transform: (v) => (v == null ? '' : v) },
    tags: { type: [{ type: String }], default: [] },
    deletedAt: { type: Date, transform: (v) => (v == null ? '' : v) },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);
postSchema.plugin(aggregatePaginate);

postSchema.index({
  content: 'text',
  tags: 'text',
});

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
