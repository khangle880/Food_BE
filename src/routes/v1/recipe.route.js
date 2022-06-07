const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/recipe.validation');
const controller = require('../../controllers/recipe.controller');

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

router.route('/:id/like').post(auth(), validate(validation.like), controller.likeRecipe);
router.route('/:id/dislike').delete(auth(), validate(validation.dislike), controller.dislikeRecipe);
router.route('/:id/mark-cook').post(auth(), validate(validation.markCook), controller.markCook);
router.route('/:id/unmark-cook').delete(auth(), validate(validation.unmarkCook), controller.unmarkCook);
router.route('/:id/vote').post(auth(), validate(validation.vote), controller.vote);
router.route('/:id/unvote').delete(auth(), validate(validation.unvote), controller.unvote);

router.route('/:id/liked-users').get(auth(), validate(validation.getLikedUsers), controller.getLikedUsers);
router.route('/:id/cooked-users').get(auth(), validate(validation.getCookedUsers), controller.getCookedUsers);
router.route('/:id/rating-users').get(auth(), validate(validation.getRatingUsers), controller.getRatingUsers);

module.exports = router;
