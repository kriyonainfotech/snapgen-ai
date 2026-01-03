// src/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Define the routes
router.post('/generate-image', aiController.generateUndresIimage);
router.post('/check-image-status', aiController.checkImageStatus);
router.post('/check-credits', aiController.checkCredits);
router.post('/generate-video', aiController.generateUndressVideo);
router.post('/check-video-status', aiController.checkVideoStatus);

module.exports = router;