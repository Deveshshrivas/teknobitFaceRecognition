const express = require('express');
const router = express.Router();
const { PhotoController, upload } = require('../controllers/photoController');
const auth = require('../middlewares/auth');

router.post('/', auth, upload.single('photo'), PhotoController.uploadPhoto);

module.exports = router;