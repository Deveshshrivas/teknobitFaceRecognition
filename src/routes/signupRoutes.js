const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const { upload, validateVideoDuration } = require('../middlewares/validateVideoDuration');

router.post('/', upload.single('profileVideo'), validateVideoDuration, signupController.handleSignup);

module.exports = router;