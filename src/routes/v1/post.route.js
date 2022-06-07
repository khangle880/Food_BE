const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/post.validation');
const controller = require('../../controllers/post.controller');

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

router.route('/:id/react').post(auth(), validate(validation.react), controller.react);
router.route('/:id/del-reaction').delete(auth(), validate(validation.deleteReaction), controller.deleteReaction);

router.route('/:id/reactions').get(auth(), validate(validation.getPostReactions), controller.getPostReactions);

module.exports = router;
