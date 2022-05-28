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
    },
    videoUrl: { type: String },
    viewRange: {
      type: String,
      enum: {
        values: ['PRIVATE', 'PUBLIC'],
        message: "Range includes: 'PRIVATE', 'PUBLIC'",
      },
      required: true,
    },
    backgroundColor: { type: String },
    content: { type: String },
    tags: { type: [{ type: String }] },
    deletedAt: { type: Date },
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
