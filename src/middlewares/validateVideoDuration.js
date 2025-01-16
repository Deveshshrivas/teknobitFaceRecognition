const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfprobePath(ffprobeStatic.path);

const uploadDir = path.join(__dirname, '../../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

function getVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
}

async function validateVideoDuration(req, res, next) {
    if (!req.file) {
        return res.status(400).json({ message: "Profile video is required." });
    }

    try {
        const duration = await getVideoDuration(req.file.path);
        if (duration > 30) {
            return res.status(400).json({ message: "Profile video must be 30 seconds or less." });
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
}

module.exports = { upload, validateVideoDuration };