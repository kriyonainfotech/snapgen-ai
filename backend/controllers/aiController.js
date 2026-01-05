// src/controllers/aiController.js
const apiClient = require('../utils/apiClient');

/**
 * Common logger
 */
const log = {
    info: (msg, data = {}) => console.log(`ℹ️  ${msg}`, data),
    success: (msg, data = {}) => console.log(`✅ ${msg}`, data),
    warn: (msg, data = {}) => console.warn(`⚠️  ${msg}`, data),
    error: (msg, data = {}) => console.error(`❌ ${msg}`, data),
};

/**
 * Common API error handler
 */
const handleApiError = (res, error, context) => {
    if (error.response) {
        // API responded with error status
        log.error(`${context} | API Error`, {
            status: error.response.status,
            data: error.response.data,
        });

        return res.status(error.response.status).json({
            success: false,
            message: "External API error",
            statusCode: error.response.status,
            details: error.response.data,
        });
    }

    if (error.request) {
        log.error(`${context} | No response from API`, error.message);

        return res.status(503).json({
            success: false,
            message: "External API not responding",
        });
    }

    log.error(`${context} | Internal Server Error`, error.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
    });
};

/**
 * 1. Generate Human Image
 */
exports.generateUndresIimage = async (req, res) => {
    log.info("Generate Human Image | Request received", req.body);

    try {
        const { file_url, mask_url, prompt, num_images, ai_model_type, width, height } = req.body;

        if (!file_url) {
            log.warn("Generate Human Image | file_url missing");
            return res.status(400).json({
                success: false,
                message: "file_url is required",
            });
        }

        // 🔹 Build payload safely
        const payload = {
            file_url,
            mask_url: mask_url || "",
            prompt: prompt || "Portrait",
            num_images: Number(num_images) || 2,
            ai_model_type: Number(ai_model_type) || 1,
            width: Number(width) || 512,
            height: Number(height) || 680,
        };

        const url = "https://api.undresswith.ai/undress_api/undress";
        log.info("Generate Human Image | Calling AI API", payload);

        const response = await apiClient.post(url, payload);

        log.success("Generate Human Image | Success", response.data);
        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {
        return handleApiError(res, error, "Generate Human Image");
    }
};

/**
 * 2. Check Image Status
 */
exports.checkImageStatus = async (req, res) => {
    log.info("Check Image Status | Request received", req.body);

    try {
        const { uid } = req.body;

        if (!uid) {
            log.warn("Check Image Status | UID missing");
            return res.status(400).json({
                success: false,
                message: "UID is required",
            });
        }

        const url = "https://api.undresswith.ai/undress_api/check_item";
        const response = await apiClient.post(url, { uid });

        log.success("Check Image Status | Success", response.data);
        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {
        return handleApiError(res, error, "Check Image Status");
    }
};

/**
 * 3. Check Credits
 */
exports.checkCredits = async (req, res) => {
    log.info("Check Credits | Request received");

    try {
        const url = "https://api.undresswith.ai/undress_api/check_credits";
        const response = await apiClient.post(url, {});

        log.success("Check Credits | Success", response.data);
        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {
        return handleApiError(res, error, "Check Credits");
    }
};

/**
 * 4. Generate Walking Video
 */
exports.generateUndressVideo = async (req, res) => {
    log.info("Generate Walking Video | Request received", req.body);

    try {
        const { file_url, prompt, pov_id, duration, width, height } = req.body;

        if (!file_url) {
            log.warn("Generate Walking Video | file_url missing");
            return res.status(400).json({
                success: false,
                message: "file_url is required",
            });
        }

        const payload = {
            file_url,
            prompt: prompt || "A person walking",
            width: width || 512,
            height: height || 680,
            pov_id: pov_id ?? 0,
            duration: duration || 5,
        };

        const url = "https://api.undresswith.ai/undress_video_api/create_task";
        const response = await apiClient.post(url, payload);

        log.success("Generate Walking Video | Success", response.data);
        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {
        return handleApiError(res, error, "Generate Walking Video");
    }
};

/**
 * 5. Check Video Status
 */
exports.checkVideoStatus = async (req, res) => {
    log.info("Check Video Status | Request received", req.body);

    try {
        const { uid } = req.body;

        if (!uid) {
            log.warn("Check Video Status | UID missing");
            return res.status(400).json({
                success: false,
                message: "UID is required",
            });
        }

        const url = "https://api.undresswith.ai/undress_video_api/check_task";
        const response = await apiClient.post(url, { uid });

        log.success("Check Video Status | Success", response.data);
        return res.status(200).json({
            success: true,
            data: response.data,
        });

    } catch (error) {
        return handleApiError(res, error, "Check Video Status");
    }
};
