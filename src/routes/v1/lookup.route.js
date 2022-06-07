const express = require('express');
const auth = require('../../middlewares/auth');
const controller = require('../../controllers/lookup.controller');

const router = express.Router();

router.route('/').get(auth(), controller.getAll);

module.exports = router;
