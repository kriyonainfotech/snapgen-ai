// src/controllers/aiController.js
const apiClient = require('../utils/apiClient');

/**
 * 1. Generate Human Image
 */
// exports.generateUndresIimage = async (req, res) => {
//     try {
//         console.log("🟢 [AI] Generate Undress Image API HIT");

//         let { file_url, mask_url, prompt, num_images, ai_model_type, width, height } = req.body;

//         console.log("📥 Incoming Body:", req.body);
//         console.log("📁 Incoming File:", req.file);

//         // 🔹 Handle Cloudinary File Upload
//         if (req.file && req.file.path) {
//             file_url = req.file.path;
//             console.log("☁️ Using Cloudinary Image URL:", file_url);
//         }

//         if (!file_url) {
//             console.warn("⚠️ No image provided");
//             return res.status(400).json({
//                 success: false,
//                 message: "Image file or file_url is required",
//             });
//         }

//         // 🔹 Build payload safely
//         const payload = {
//             file_url,
//             mask_url: mask_url || "",
//             prompt: prompt || "Portrait",
//             num_images: Number(num_images) || 2,
//             ai_model_type: Number(ai_model_type) || 1,
//             width: Number(width) || 512,
//             height: Number(height) || 680,
//         };

//         console.log("📤 Sending Payload to AI:", payload);

//         const url = "https://api.undresswith.ai/undress_api/undress";
//         const response = await apiClient.post(url, payload);

//         console.log("📤 SAI Image Generated Successfully------------------------    :", response.data);
//         console.log(
//             "✅ AI Image Generated Successfully:\n",
//             JSON.stringify(response.data, null, 2)
//         );

//         return res.status(200).json(response.data);

//     } catch (error) {
//         console.error("❌ AI Image Generation Failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

/**
 * 2. Check Image Status
 */
// exports.checkImageStatus = async (req, res) => {
//     try {
//         console.log("🟡 [AI] Check Image Status API HIT");

//         const { uid } = req.body;
//         console.log("🆔 UID:", uid);

//         if (!uid) {
//             console.warn("⚠️ UID missing");
//             return res.status(400).json({
//                 success: false,
//                 message: "UID is required",
//             });
//         }

//         const url = "https://api.undresswith.ai/undress_api/check_item";
//         const response = await apiClient.post(url, { uid });

//         console.log("✅ Image Status Fetched", response.data);

//         return res.status(200).json(response.data);

//     } catch (error) {
//         console.error("❌ Check Image Status Failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

/**
 * 1. Generate Human Image (MOCKED)
 */
exports.generateUndresIimage = async (req, res) => {
    try {
        console.log("🟢 [AI][MOCK] Generate Undress Image API HIT");

        let { file_url } = req.body;

        console.log("📥 Incoming Body:", req.body);
        console.log("📁 Incoming File:", req.file);

        if (req.file && req.file.path) {
            file_url = req.file.path;
            console.log("☁️ Using Cloudinary Image URL:", file_url);
        }

        if (!file_url) {
            console.warn("⚠️ No image provided");
            return res.status(400).json({
                success: false,
                message: "Image file or file_url is required",
            });
        }

        // ❌ COMMENTED OUT REAL API CALL
        // const url = "https://api.undresswith.ai/undress_api/undress";
        // const response = await apiClient.post(url, payload);

        // ✅ MOCK RESPONSE
        const mockResponse = {
            code: 1,
            message: "success",
            data: {
                uid: "mock_uid_123456789",
                estimated_time: 8
            }
        };

        console.log(
            "✅ [MOCK] AI Image Generated:\n",
            JSON.stringify(mockResponse, null, 2)
        );

        return res.status(200).json(mockResponse);

    } catch (error) {
        console.error("❌ [MOCK] AI Image Generation Failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/**
 * 2. Check Image Status (MOCKED)
 */
exports.checkImageStatus = async (req, res) => {
    try {
        console.log("🟡 [AI][MOCK] Check Image Status API HIT");

        const { uid } = req.body;
        console.log("🆔 UID:", uid);

        if (!uid) {
            console.warn("⚠️ UID missing");
            return res.status(400).json({
                success: false,
                message: "UID is required",
            });
        }

        // ❌ COMMENTED OUT REAL API CALL
        // const url = "https://api.undresswith.ai/undress_api/check_item";
        // const response = await apiClient.post(url, { uid });

        // ✅ MOCK RESPONSE (FINAL COMPLETED STATE)
        const mockStatusResponse = {
            code: 1,
            message: "success",
            data: {
                uid,
                status: 2,
                results: [
                    "http://res.aivio.art/clothes_change/output/1767708620_1t239o_2.jpg",
                    // "https://res.aivio.art/clothes_change/output/mock_image_2.jpg"
                ]
            }
        };

        console.log(
            "✅ [MOCK] Image Status Response:\n",
            JSON.stringify(mockStatusResponse, null, 2)
        );

        return res.status(200).json(mockStatusResponse);

    } catch (error) {
        console.error("❌ [MOCK] Check Image Status Failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * 3. Check Credits
 */
exports.checkCredits = async (req, res) => {
    try {
        console.log("🔵 [AI] Check Credits API HIT");

        const url = "https://api.undresswith.ai/undress_api/check_credits";
        const response = await apiClient.post(url, {});

        console.log("💰 Credits Retrieved Successfully", response.data);

        return res.status(200).json(response.data);

    } catch (error) {
        console.error("❌ Credit Check Failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/**
 * 4. Generate Walking Video
 */
// exports.generateUndressVideo = async (req, res) => {
//     try {
//         console.log("🟣 [AI] Generate Video API HIT");

//         let { file_url, prompt, pov_id, duration, width, height } = req.body;

//         console.log("📥 Incoming Body:", req.body);
//         console.log("📁 Incoming File:", req.file);

//         // 🔹 Handle Cloudinary File Upload
//         if (req.file && req.file.path) {
//             file_url = req.file.path;
//             console.log("☁️ Using Cloudinary Video URL:", file_url);
//         }

//         if (!file_url) {
//             console.warn("⚠️ file_url missing");
//             return res.status(400).json({
//                 success: false,
//                 message: "Video file or file_url is required",
//             });
//         }

//         const payload = {
//             file_url,
//             prompt: prompt || "A person walking",
//             width: width || 512,
//             height: height || 680,
//             pov_id: pov_id ?? 25,
//             duration: duration || 5,
//         };

//         console.log("📤 Sending Video Payload:", payload);

//         const url = "https://api.undresswith.ai/undress_video_api/create_task";
//         const response = await apiClient.post(url, payload);

//         console.log("🎬 Video Task Created Successfully", response.data);
//         console.log(
//             "✅ AI Video Generated Successfully:\n",
//             JSON.stringify(response.data, null, 2)
//         );
//         return res.status(200).json(response.data);

//     } catch (error) {
//         console.log("❌ Video Generation Failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

/**
 * 5. Check Video Status
 */
// exports.checkVideoStatus = async (req, res) => {
//     try {
//         console.log("🟠 [AI] Check Video Status API HIT");

//         const { uid } = req.body;
//         console.log("🆔 Video UID:", uid);

//         if (!uid) {
//             console.warn("⚠️ UID missing");
//             return res.status(400).json({
//                 success: false,
//                 message: "UID is required",
//             });
//         }

//         const url = "https://api.undresswith.ai/undress_video_api/check_task";
//         const response = await apiClient.post(url, { uid });

//         console.log("✅ Video Status Retrieved", response.data);
//         console.log(
//             "✅ Video Status Retrieved:\n",
//             JSON.stringify(response.data, null, 2)
//         );

//         return res.status(200).json(response.data);

//     } catch (error) {
//         console.log("❌ Check Video Status Failed:", error.message);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

/**
 * 4. Generate Walking / Undress Video (MOCK ONLY)
 */
exports.generateUndressVideo = async (req, res) => {
    try {
        console.log("🟣 [AI][MOCK] Generate Video API HIT");

        let { file_url } = req.body;

        console.log("📥 Incoming Body:", req.body);
        console.log("📁 Incoming File:", req.file);

        if (req.file && req.file.path) {
            file_url = req.file.path;
            console.log("☁️ Using Cloudinary Video URL:", file_url);
        }

        if (!file_url) {
            return res.status(400).json({
                success: false,
                message: "Video file or file_url is required",
            });
        }

        // ✅ PURE MOCK RESPONSE
        const mockResponse = {
            code: 1,
            message: "success",
            data: {
                uid: "mock_video_uid_123456",
                estimated_time: 70
            }
        };

        console.log(
            "✅ [MOCK] Video Task Created:\n",
            JSON.stringify(mockResponse, null, 2)
        );

        return res.status(200).json(mockResponse);

    } catch (error) {
        console.error("❌ [MOCK] Generate Video Failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * 5. Check Video Status (MOCK ONLY)
 */
exports.checkVideoStatus = async (req, res) => {
    try {
        console.log("🟠 [AI][MOCK] Check Video Status API HIT");

        const { uid } = req.body;
        console.log("🆔 Video UID:", uid);

        if (!uid) {
            return res.status(400).json({
                success: false,
                message: "UID is required",
            });
        }

        // ✅ PURE MOCK COMPLETED RESPONSE
        const mockStatusResponse = {
            code: 1,
            message: "success",
            data: {
                uid,
                status: 2, // completed
                results: [
                    "https://res.aivio.art/videos/cff0dcd181e2d180a62d1f77a685acb2.mp4"
                ]
            }
        };

        console.log(
            "✅ [MOCK] Video Status Response:\n",
            JSON.stringify(mockStatusResponse, null, 2)
        );

        return res.status(200).json(mockStatusResponse);

    } catch (error) {
        console.error("❌ [MOCK] Check Video Status Failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
