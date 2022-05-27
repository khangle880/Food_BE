const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { trainingItemValidation: validation } = require('../../validations');
const { trainingItemController: controller } = require('../../controllers');
const { trainingItemPermission: permission } = require('../../permissions');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(validation.create), permission.canCreate, controller.create)
  .get(auth(), validate(validation.getItems), permission.canViewItems, controller.getItems);

router
  .route('/:id')
  .get(auth(), validate(validation.getById), permission.verifyItem, controller.getById)
  .put(auth(), validate(validation.updateById), permission.verifyItem, controller.updateById)
  .delete(auth(), validate(validation.deleteById), permission.verifyItem, controller.deleteById);

module.exports = router;
