const express = require('express');
const router = express.Router();
const { VideoController, upload } = require('../controllers/videoController');

router.post('/', upload.single('video'), VideoController.uploadVideo);

module.exports = router;