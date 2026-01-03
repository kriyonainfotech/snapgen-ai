// src/controllers/aiController.js
const apiClient = require('../utils/apiClient');

// 1. Generate Human Image
exports.generateHumanImage = async (req, res) => {
    try {
        const { file_url, mask_url, prompt } = req.body;

        if (!file_url) return res.status(400).json({ error: "file_url is required" });

        const payload = {
            file_url,
            mask_url: mask_url || "",
            prompt: prompt || "Portrait",
            num_images: 2,
            ai_model_type: 1,
            width: 512,
            height: 680
        };

        // Replace with REAL URL
        const url = "https://api.undresswith.ai/undress_api/undress";
        const response = await apiClient.post(url, payload);
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
};

// 2. Check Image Status
exports.checkImageStatus = async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ error: "UID is required" });

        // Replace with REAL URL
        const url = "https://api.undresswith.ai/undress_api/check_item";
        const response = await apiClient.post(url, { uid });
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
};

// 3. Check Credits
exports.checkCredits = async (req, res) => {
    try {
        // Replace with REAL URL
        const url = "https://api.undresswith.ai/undress_api/check_credits";
        // Passing empty object {} as body
        const response = await apiClient.post(url, {});
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
};

// 4. Generate Walking Video
exports.generateWalkingVideo = async (req, res) => {
    try {
        const { file_url, prompt, pov_id, duration } = req.body;
        if (!file_url) return res.status(400).json({ error: "file_url is required" });

        const payload = {
            file_url,
            prompt: prompt || "A person walking",
            width: 512,
            height: 680,
            pov_id: pov_id !== undefined ? pov_id : 0,
            duration: duration || 5
        };

        // Replace with REAL URL
        const url = "https://api.undresswith.ai/undress_video_api/create_task";
        const response = await apiClient.post(url, payload);
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
};

// 5. Check Video Status
exports.checkVideoStatus = async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) return res.status(400).json({ error: "UID is required" });

        // Replace with REAL URL
        const url = "https://api.undresswith.ai/undress_video_api/check_task";
        const response = await apiClient.post(url, { uid });
        res.status(200).json(response.data);

    } catch (error) {
        res.status(500).json({ error: error.message, details: error.response?.data });
    }
};