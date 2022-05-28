const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validation = require('../../validations/me.validation');
const controller = require('../../controllers/me.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), controller.getMe)
  .put(auth(), validate(validation.updateMe), controller.updateMe)
  .delete(auth(), controller.deleteMe);

router.route('/liked-recipes').get(auth(), controller.getLikedRecipes);
router.route('/change-password').put(auth(), validate(validation.changePassword), controller.changePassword);

module.exports = router;
