const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const upload = require('../middlewares/upload');

const bucketName = 'videos';

const uploadVideos = async (req, res) => {
  try {
    await upload.uploadVideos(req, res);

    if (req.files.length <= 0) {
      return res.status(400).send({ message: 'You must select at least 1 file.' });
    }

    return res.status(200).send({
      urls: req.files.map((e) => `/v1/${bucketName}/${e.id}.${e.contentType.split('/')[1]}`),
    });
  } catch (error) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).send({
        message: 'Too many files to upload.',
      });
    }
    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });
  }
};

const getListVideos = async (req, res) => {
  try {
    const images = mongoose.connection.db.collection(`${bucketName}.files`);
    const cursor = images.find({});
    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: 'No files found!',
      });
    }
    const fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: `/v1/${bucketName}/${doc._id}.${doc.contentType.split('/')[1]}`,
      });
    });
    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const downloadVideo = async (req, res) => {
  try {
    const database = mongoose.connection.db;
    const bucket = new GridFSBucket(database, {
      bucketName,
    });
    const downloadStream = bucket.openDownloadStream(mongoose.Types.ObjectId(req.params.id.split('.')[0]));
    downloadStream.on('data', function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on('error', function () {
      return res.status(404).send({ message: 'Cannot download the Video!' });
    });
    downloadStream.on('end', () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  uploadVideos,
  getListVideos,
  downloadVideo,
};
