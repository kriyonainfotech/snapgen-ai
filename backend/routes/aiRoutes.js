// src/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { upload } = require('../utils/cloudinary');


// Define the routes
router.post('/generate-image', upload.single('image'), aiController.generateUndresIimage);
router.post('/check-image-status', aiController.checkImageStatus);
router.post('/check-credits', aiController.checkCredits);
router.post('/generate-video', upload.single('video'), aiController.generateUndressVideo);
router.post('/check-video-status', aiController.checkVideoStatus);
// router.get('/stream', aiController.streamVideo);

module.exports = router;