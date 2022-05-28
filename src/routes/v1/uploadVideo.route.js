const express = require('express');
const controller = require('../../controllers/uploadVideo.controller');

const router = express.Router();

router.post('/', controller.uploadVideos);
router.get('/', controller.getListVideos);
router.get('/:id', controller.downloadVideo);

module.exports = router;
