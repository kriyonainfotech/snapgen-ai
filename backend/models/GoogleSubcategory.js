const mongoose = require('mongoose');

const GoogleSubcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    prompt: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GoogleCategory',
        required: true
    },
    povId: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('GoogleSubcategory', GoogleSubcategorySchema);
