const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    userId: {
        type: Number, // Change to Number to match primaryKeyId type
        required: true
    },
    path: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Photo', photoSchema);