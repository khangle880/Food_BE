const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/user.validation');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(validation.create), controller.create)
  .get(auth('admin'), validate(validation.getItems), controller.getItems);

router
  .route('/:id')
  .get(auth(), validate(validation.getById), controller.getById)
  .put(auth(), validate(validation.updateById), controller.updateById)
  .delete(auth(), validate(validation.deleteById), controller.deleteById);

router.route('/:id/follow').post(auth(), validate(validation.follow), controller.follow);
router.route('/:id/unfollow').delete(auth(), validate(validation.unFollow), controller.unFollow);

router.route('/:id/liked-recipes').get(auth(), validate(validation.getLikedRecipes), controller.getLikedRecipes);

module.exports = router;
