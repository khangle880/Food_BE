const express = require('express');
const controller = require('../../controllers/uploadImage.controller');

const router = express.Router();

router.post('/', controller.uploadImages);
router.get('/', controller.getListImages);
router.get('/:id', controller.downloadImage);

module.exports = router;
