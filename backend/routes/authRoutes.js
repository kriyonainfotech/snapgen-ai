const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/admins', authMiddleware, authController.getAllAdmins);
router.post('/admins', authMiddleware, authController.createAdmin);
router.put('/admins/:id', authMiddleware, authController.updateAdmin);
router.delete('/admins/:id', authMiddleware, authController.deleteAdmin);

module.exports = router;
