const mongoose = require('mongoose');

const GoogleCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ['image', 'video']
    },
    imageUrl: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('GoogleCategory', GoogleCategorySchema);
