const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: Buffer,
        required: true
    },
    frames: [{
        type: Buffer,
        required: true
    }]
});

module.exports = mongoose.model('Video', videoSchema);