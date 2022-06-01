const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/cookMethod.validation');
const controller = require('../../controllers/cookMethod.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(validation.create), controller.create)
  .get(auth(), validate(validation.getItems), controller.getItems);

router
  .route('/:id')
  .get(auth(), validate(validation.getById), controller.getById)
  .put(auth(), validate(validation.updateById), controller.updateById)
  .delete(auth(), validate(validation.deleteById), controller.deleteById);

module.exports = router;
