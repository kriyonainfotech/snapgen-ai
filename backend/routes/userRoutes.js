const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware);

router.post('/create', userController.createUser);
router.get('/all', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
