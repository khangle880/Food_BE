const httpStatus = require('http-status');
const axios = require('axios');
const ApiError = require('../utils/ApiError');
const { interceptor, METHOD } = require('../config/interceptor');
const catchAsync = require('../utils/catchAsync');
const { recipeService } = require('../services');
const { Unit } = require('../models');

const spamRecipe = catchAsync(async (req, res) => {
  const ids = ['51996', '15327', '41436', '37837', '3030'];
  await Promise.all(
    ids.map(async (id) => {
      const interceptorConfig = interceptor(
        `https://marketapi.cooky.vn/recipe/v1.3/detail?checksum=7385b0bfa7819be1751bae40d658e3de&id=${id}`,
        METHOD.GET
      );

      await axios(interceptorConfig)
        .then(async (response) => {
          const { data } = response.data;
          const json = {
            description: data.description,
            name: data.name,
            servings: data.servings,
            steps: data.steps.map((e) => {
              return {
                content: e.content,
                photoUrls: e.photos !== undefined ? e.photos.map((p) => p[p.length - 1].url) : undefined,
              };
            }),
            totalTime: data.totalTime,
            // ingredients: [
            //   {
            //     name: 'nạc thăn',
            //     typeId: '629d772ba54468691134af85',
            //     unitId: '629715688e3241a5d79f0182',
            //     quantity: '10',
            //   },
            //   {
            //     name: 'ba rọi',
            //     typeId: '629d772ba54468691134af85',
            //     unitId: '629715688e3241a5d79f0182',
            //     quantity: '15',
            //   },
            // ],
            // menuTypes: [],
            // specialGoals: [],
            cuisineId: '6292644db2204600ffe18ce1',
            dishTypeId: '62926d061d0652298c69b508',
            cookMethodId: '62962e909f59f458604571fe',
          };
          if (data.hasVideo) {
            json.videoThumbnail = data.photos[0][data.photos[0].length - 1].url;
            json.videoUrl = data.videoUrl;
          } else {
            json.photoUrls = data.photos !== undefined ? data.photos.map((p) => p[p.length - 1].url) : undefined;
          }
          if (data.steps.length < 8) {
            if (data.steps.length < 5) {
              json.level = 'EAZY';
            } else json.level = 'MEDIUM';
          } else json.level = 'HARD';
          const ingredients = [];
          await Promise.all(
            data.ingredients.map(async (element) => {
              let unit = await Unit.findOne({ name: element.unit.unit });
              if (unit == null) {
                unit = await Unit.create({ name: element.unit.unit });
              }
              let { quantity } = element;
              if (quantity.includes('/')) {
                const parts = quantity.split('/');
                quantity = parts[0] / parts[1];
              }
              ingredients.push({
                unitId: unit.id,
                quantity,
                name: element.name,
                typeId: '629d772ba54468691134af85',
              });
            })
          );
          json.ingredients = ingredients;
          // eslint-disable-next-line no-restricted-syntax
          for (const key in json) {
            if (json[key] == null) delete json[key];
          }
          await recipeService.create(req.user.id, json);
        })
        .catch(function (error) {
          throw new ApiError(httpStatus.BAD_GATEWAY, error);
        });
    })
  );

  res.send('okie');
});

module.exports = {
  spamRecipe,
};
