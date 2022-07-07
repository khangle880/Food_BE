const express = require('express');
const AppConfig = require('../../models/appConfig.model');

const router = express.Router();

router.route('/').get(async (req, res) => {
  const appConfig = await AppConfig.findById('62c2640c1eb3cffe134510d0');
  res.send(appConfig);
});
router.route('/').post(async (req, res) => {
  const item = await AppConfig.findById('62c2640c1eb3cffe134510d0');
  Object.assign(item, { ngrokUrl: req.query.url });
  await item.save();
  res.send(item);
});

module.exports = router;
