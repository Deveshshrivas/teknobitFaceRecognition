const User = require('../models/userModel');
const Video = require('../models/videoModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

class SignupController {
    async handleSignup(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const profileVideo = req.file;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
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

            // Process video and store in binary format
            const videoBuffer = fs.readFileSync(profileVideo.path);
            const frames = await this.extractFrames(profileVideo.path);

            const video = new Video({
                userId: user._id,
                video: videoBuffer,
                frames: frames
            });

            await video.save();

            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }

    extractFrames(videoPath) {
        return new Promise((resolve, reject) => {
            const frames = [];
            const tempDir = path.join(__dirname, '../../tmp');

            // Ensure the temporary directory exists
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            ffmpeg(videoPath)
                .on('end', () => {
                    resolve(frames);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .screenshots({
                    count: 5,
                    folder: tempDir,
                    size: '320x240'
                })
                .on('filenames', (filenames) => {
                    filenames.forEach((filename) => {
                        const frameBuffer = fs.readFileSync(path.join(tempDir, filename));
                        frames.push(frameBuffer);
                    });
                });
        });
    }
}

module.exports = new SignupController();