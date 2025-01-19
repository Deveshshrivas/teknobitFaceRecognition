const Video = require('../models/videoModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userDir = path.join(__dirname, '../../UserFiles', req.body.userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

class VideoController {
    constructor() {
        this.uploadVideo = this.uploadVideo.bind(this);
    }

    async uploadVideo(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: "No video uploaded." });
        }

        const userId = req.body.userId;
        const videoPath = path.join('/UserFiles', userId, req.file.filename);

        try {
            const video = new Video({
                userId: userId,
                videoPath: videoPath
            });

            await video.save();

            res.status(201).json({ message: "Video uploaded successfully." });
        } catch (error) {
            console.error('Error during video upload:', error);
            res.status(500).json({ message: "Video upload failed.", error: error.message });
        }
    }
}

module.exports = { VideoController: new VideoController(), upload };