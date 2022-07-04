const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const appConfigSchema = mongoose.Schema(
  {
    ngrokUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
appConfigSchema.plugin(toJSON);

/**
 * @typedef AppConfig
 */
const AppConfig = mongoose.model('AppConfig', appConfigSchema);

module.exports = AppConfig;
