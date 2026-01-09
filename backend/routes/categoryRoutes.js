const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// router.use(authMiddleware);

router.post('/create', upload.single('image'), categoryController.createCategory);
router.get('/get/:type', categoryController.getCategoriesByType);
router.get("/all", categoryController.getAllCategories);
router.get("/nested-all", categoryController.getNestedCategories);
router.get('/get/:id', categoryController.getCategoryById);
router.put('/update/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
