const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

class SignupController {
    async handleSignup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { primaryKeyId, name, email, password } = req.body;
        const profileVideo = req.file;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "User already exists." });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            user = new User({
                primaryKeyId,
                name,
                email,
                password: hashedPassword,
                profileVideo: profileVideo.path
            });

            await user.save();

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
}

module.exports = new SignupController();