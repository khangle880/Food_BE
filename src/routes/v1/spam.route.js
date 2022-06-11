const express = require('express');
const auth = require('../../middlewares/auth');
const controller = require('../../controllers/spam.controller');

const router = express.Router();

router.route('/recipe').post(auth(), controller.spamRecipe);

module.exports = router;
