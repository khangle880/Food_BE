const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/recipe.validation');
const controller = require('../../controllers/recipe.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(validation.create), controller.create)
  .get(validate(validation.getItems), controller.getItems);

router
  .route('/:id')
  .get(validate(validation.getById), controller.getById)
  .put(auth(), validate(validation.updateById), controller.updateById)
  .delete(auth(), validate(validation.deleteById), controller.deleteById);

router.route('/:id/like').post(auth(), validate(validation.like), controller.likeRecipe);
router.route('/:id/dislike').post(auth(), validate(validation.dislike), controller.dislikeRecipe);
router.route('/:id/mark-cook').post(auth(), validate(validation.markCook), controller.markCook);
router.route('/:id/ummark-cook').post(auth(), validate(validation.unmarkCook), controller.unmarkCook);
router
  .route('/:id/rate')
  .post(auth(), validate(validation.rate), controller.rateRecipe)
  .delete(auth(), validate(validation.deleteRating), controller.deleteRating);

module.exports = router;
