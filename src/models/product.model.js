const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ProductType',
    },
    photoUrls: {
      type: [{ type: String }],
      required: true,
    },
    videoUrl: { type: String, transform: (v) => (v == null ? '' : v) },
    description: { type: String, required: true },
    price: { type: Number, transform: (v) => (v == null ? '' : v) },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', transform: (v) => (v == null ? '' : v) },
    saleLocations: { type: [{ type: String }], default: [] },
    deletedAt: { type: Date, transform: (v) => (v == null ? '' : v) },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
productSchema.plugin(aggregatePaginate);

productSchema.index({
  description: 'text',
  price: 'text',
  saleLocations: 'text',
});

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
