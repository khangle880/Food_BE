const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const meRoute = require('./me.route');
const recipeRoute = require('./recipe.route');
const postRoute = require('./post.route');
const commentRoute = require('./comment.route');
const productRoute = require('./product.route');
const specialGoalRoute = require('./specialGoal.route');
const menuTypeRoute = require('./menuType.route');
const cuisineRoute = require('./cuisine.route');
const ingredientTypeRoute = require('./ingredientType.route');
const unitRoute = require('./unit.route');
const productTypeRoute = require('./productType.route');
const dishTypeRoute = require('./dishType.route');
const cookMethodRoute = require('./cookMethod.route');
const searchRoute = require('./search.route');
const lookupRoute = require('./lookup.route');
const uploadVideoRoute = require('./uploadVideo.route');
const uploadImageRoute = require('./uploadImage.route');
const messageRoute = require('./message.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/me',
    route: meRoute,
  },
  {
    path: '/recipes',
    route: recipeRoute,
  },
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/ingredient-types',
    route: ingredientTypeRoute,
  },
  {
    path: '/special-goals',
    route: specialGoalRoute,
  },
  {
    path: '/menu-types',
    route: menuTypeRoute,
  },
  {
    path: '/cuisines',
    route: cuisineRoute,
  },
  {
    path: '/units',
    route: unitRoute,
  },
  {
    path: '/product-types',
    route: productTypeRoute,
  },
  {
    path: '/dish-types',
    route: dishTypeRoute,
  },
  {
    path: '/cook-methods',
    route: cookMethodRoute,
  },
  {
    path: '/search',
    route: searchRoute,
  },
  {
    path: '/lookup',
    route: lookupRoute,
  },
  {
    path: '/videos',
    route: uploadVideoRoute,
  },
  {
    path: '/photos',
    route: uploadImageRoute,
  },

  {
    path: '/message',
    route: messageRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
