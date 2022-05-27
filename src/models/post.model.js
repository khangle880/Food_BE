const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const postRecipe = mongoose.Schema(
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
postRecipe.plugin(toJSON);
postRecipe.plugin(paginate);

postRecipe.index({
  content: 'text',
  tags: 'text',
});

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postRecipe);

module.exports = Post;
