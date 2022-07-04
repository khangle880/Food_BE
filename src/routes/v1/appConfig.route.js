const express = require('express');
const AppConfig = require('../../models/appConfig.model');

const router = express.Router();

router.route('/').get(async (req, res) => {
  const appConfig = await AppConfig.findById('62c2640c1eb3cffe134510d0');
  res.send(appConfig);
});

module.exports = router;
