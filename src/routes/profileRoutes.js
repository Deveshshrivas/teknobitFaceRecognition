const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const profileController = require('../controllers/profileController');

router.get('/', auth, profileController.getProfile);

module.exports = router;