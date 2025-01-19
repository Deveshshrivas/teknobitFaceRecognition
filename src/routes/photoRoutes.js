const express = require('express');
const router = express.Router();
const { PhotoController, upload } = require('../controllers/photoController');
const auth = require('../middlewares/auth');

router.post('/', auth, upload.single('photo'), PhotoController.uploadPhoto);
router.get('/:userId', auth, PhotoController.getPhotosByUserId); // Add this route

module.exports = router;