const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
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
    // mainCategory: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'MainCategory',
    //     required: true
    // }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
