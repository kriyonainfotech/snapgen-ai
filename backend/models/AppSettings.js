const mongoose = require('mongoose');

const AppSettingsSchema = new mongoose.Schema({
    onboarding: [
        {
            headline: { type: String, trim: true },
            description: { type: String, trim: true },
            image: { type: String }
        }
    ],
    carouselBanners: [
        {
            headline: { type: String, trim: true },
            description: { type: String, trim: true },
            image: { type: String }
        }
    ],
    removeBgToolImage: { type: String },
    imageUpscalerToolImage: { type: String },
    faceSwapToolImage: { type: String },
    undressImageToolImage: { type: String },
    undressVideoToolImage: { type: String },
    undressImageIntroBeforeImage: { type: String },
    undressImageIntroAfterImage: { type: String },
    faceSwapApiUrl: { type: String },
    faceSwapApiKeys: [{ type: String }],
    briaApiUrl: { type: String },
    briaApiKeys: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', AppSettingsSchema);
