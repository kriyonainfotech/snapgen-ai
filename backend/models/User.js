const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    coins: {
        type: Number,
        default: 0
    },
    isp: {
        type: String,
        trim: true
    },
    org: {
        type: String,
        trim: true
    },
    appVersion: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Note: ID (auto generate) is handled by MongoDB's _id by default.
// If a custom short ID is needed, we can add it here.

module.exports = mongoose.model('User', UserSchema);
