const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    primaryKeyId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileVideo: {
        type: String,
        required: true
    }
});

// Apply the auto-increment plugin to the schema
userSchema.plugin(AutoIncrement, { inc_field: 'primaryKeyId' });

module.exports = mongoose.model('User', userSchema);