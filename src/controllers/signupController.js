const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

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

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = new SignupController();