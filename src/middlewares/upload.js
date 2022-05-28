const util = require('util');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storageImage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'photos',
      filename: `${Date.now()}-foodlove-${file.originalname}`,
    };
  },
});
const storageVideo = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'videos',
      filename: `${Date.now()}-foodlove-${file.originalname}`,
    };
  },
});

const uploadPhotos = multer({ storage: storageImage }).array('file', 10);
const uploadVideos = multer({ storage: storageVideo }).array('file', 10);
const uploadPhotosMiddleware = util.promisify(uploadPhotos);
const uploadVideosMiddleware = util.promisify(uploadVideos);
module.exports = {
  uploadPhotos: uploadPhotosMiddleware,
  uploadVideos: uploadVideosMiddleware,
};
