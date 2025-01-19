const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config();

class SignupController {
    constructor() {
        this.handleSignup = this.handleSignup.bind(this);
    }

    async handleSignup(req, res) {
        console.log('handleSignup called');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const profileVideo = req.file;

        if (!profileVideo) {
            console.log('Profile video is required');
            return res.status(400).json({ message: "Profile video is required." });
        }

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                console.log('User already exists');
                // Delete the uploaded profile video file
                fs.unlinkSync(profileVideo.path);
                return res.status(400).json({ message: "User already exists." });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            user = new User({
                name,
                email,
                password: hashedPassword,
                profileVideo: profileVideo.path
            });

            await user.save();
            console.log('User saved:', user);

            // Prepare form data
            const formData = new FormData();
            formData.append('userId', user.primaryKeyId.toString()); // Use the primaryKeyId for the video upload
            formData.append('video', fs.createReadStream(profileVideo.path));

            // Upload video to the new route
            const videoUploadResponse = await axios.post(process.env.VIDEO_UPLOAD_URL, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            console.log('Video upload response status:', videoUploadResponse.status);
            console.log('Video upload response data:', videoUploadResponse.data);

            if (videoUploadResponse.status !== 201) {
                console.log('Video upload failed');
                return res.status(500).json({ message: "Video upload failed." });
            }

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = new SignupController();