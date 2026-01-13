const express = require('express');
const router = express.Router();
const AppSettings = require('../models/AppSettings');
const { upload } = require('../utils/cloudinary');

// Get AppSettings
router.get('/', async (req, res) => {
    try {
        let settings = await AppSettings.findOne();
        if (!settings) {
            settings = await AppSettings.create({
                onboarding: [],
                carouselBanners: []
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update AppSettings
router.post('/update', upload.any(), async (req, res) => {
    try {
        let settings = await AppSettings.findOne();
        if (!settings) {
            settings = new AppSettings();
        }

        const { onboarding, carouselBanners, faceSwapApiUrl, faceSwapApiKeys, briaApiUrl, briaApiKeys } = req.body;

        // Parse JSON strings if they come as strings
        if (onboarding) settings.onboarding = typeof onboarding === 'string' ? JSON.parse(onboarding) : onboarding;
        if (carouselBanners) settings.carouselBanners = typeof carouselBanners === 'string' ? JSON.parse(carouselBanners) : carouselBanners;

        if (faceSwapApiUrl !== undefined) settings.faceSwapApiUrl = faceSwapApiUrl;
        if (faceSwapApiKeys) settings.faceSwapApiKeys = typeof faceSwapApiKeys === 'string' ? JSON.parse(faceSwapApiKeys) : faceSwapApiKeys;
        if (briaApiUrl !== undefined) settings.briaApiUrl = briaApiUrl;
        if (briaApiKeys) settings.briaApiKeys = typeof briaApiKeys === 'string' ? JSON.parse(briaApiKeys) : briaApiKeys;

        // Map uploaded files to fields
        if (req.files) {
            req.files.forEach(file => {
                const fieldname = file.fieldname;
                if (fieldname.startsWith('onboarding[')) {
                    // onboarding[0][image]
                    const index = parseInt(fieldname.match(/\[(\d+)\]/)[1]);
                    if (settings.onboarding[index]) {
                        settings.onboarding[index].image = file.path;
                    }
                } else if (fieldname.startsWith('carouselBanners[')) {
                    const index = parseInt(fieldname.match(/\[(\d+)\]/)[1]);
                    if (settings.carouselBanners[index]) {
                        settings.carouselBanners[index].image = file.path;
                    }
                } else {
                    // Tool images
                    settings[fieldname] = file.path;
                }
            });
        }

        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
