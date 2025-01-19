const User = require('../models/userModel');
const Photo = require('../models/photoModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userDir = path.join(__dirname, '../../UserFiles', req.user.userId);
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

class PhotoController {
    constructor() {
        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.getPhotosByUserId = this.getPhotosByUserId.bind(this);
    }

    async uploadPhoto(req, res) {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const userId = req.user.userId;
        const photoPath = path.join('/UserFiles', userId, req.file.filename);

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            const photo = new Photo({
                userId: user.primaryKeyId, // Use primaryKeyId instead of _id
                path: photoPath
            });

            await photo.save();

            res.status(200).json({ message: "Photo uploaded successfully.", photo });
        } catch (error) {
            console.error('Error during photo upload:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    async getPhotosByUserId(req, res) {
        const userId = req.params.userId;

        try {
            const photos = await Photo.find({ userId: userId });
            res.status(200).json(photos);
        } catch (error) {
            console.error('Error fetching photos:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = { PhotoController: new PhotoController(), upload };