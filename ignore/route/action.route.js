const express = require('express');
const validate = require('../../src/middlewares/validate');
const auth = require('../../src/middlewares/auth');
const { actionValidation: validation } = require('../../src/validations');
const { actionController: controller } = require('../../src/controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(validation.create), controller.create)
  .get(auth(), validate(validation.getItems), controller.getItems);

router
  .route('/:id')
  .get(auth(), validate(validation.getById), controller.getById)
  .put(auth('admin'), validate(validation.updateById), controller.updateById)
  .delete(auth('admin'), validate(validation.deleteById), controller.deleteById);

module.exports = router;
