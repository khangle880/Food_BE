const express = require('express');
const validate = require('../../src/middlewares/validate');
const auth = require('../../src/middlewares/auth');
const { chatbotValidation: validation } = require('../../src/validations');
const { chatbotController: controller } = require('../../src/controllers');
const verifyChatbot = require('../../permissions/chatbot.permission');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(validation.create), controller.create)
  .get(auth('admin'), validate(validation.getItems), controller.getItems);

router.route('/me').get(auth(), validate(validation.getMyItems), controller.getMyItems);

router
  .route('/:id')
  .get(auth(), validate(validation.getById), verifyChatbot, controller.getById)
  .put(auth(), validate(validation.updateById), verifyChatbot, controller.updateById)
  .delete(auth(), validate(validation.deleteById), verifyChatbot, controller.deleteById);

module.exports = router;
