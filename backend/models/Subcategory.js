const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
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
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Subcategory', SubcategorySchema);
