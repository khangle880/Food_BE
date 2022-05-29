const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/message.validation');
const controller = require('../../controllers/message.controller');

const router = express.Router();

router.route('/').post(auth(), validate(validation.sendMessage), controller.getMessage);

module.exports = router;
