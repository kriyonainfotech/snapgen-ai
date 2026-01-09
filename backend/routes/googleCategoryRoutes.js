const express = require('express');
const router = express.Router();
const googleCategoryController = require('../controllers/googleCategoryController');
const { upload } = require('../utils/cloudinary');

router.post('/create', upload.single('image'), googleCategoryController.createCategory);
router.get('/get/:type', googleCategoryController.getCategoriesByType);
router.get("/all", googleCategoryController.getAllCategories);
router.get("/nested-all", googleCategoryController.getNestedCategories);
router.get('/get/:id', googleCategoryController.getCategoryById);
router.put('/update/:id', upload.single('image'), googleCategoryController.updateCategory);
router.delete('/delete/:id', googleCategoryController.deleteCategory);

module.exports = router;
