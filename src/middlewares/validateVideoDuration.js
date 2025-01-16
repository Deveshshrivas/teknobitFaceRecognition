const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

async function validateVideoDuration(req, res, next) {
    if (!req.file) {
        return res.status(400).json({ message: "Profile video is required." });
    }

    // Assuming you want to skip video duration validation
    next();
}

module.exports = { upload, validateVideoDuration };