const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// router.use(authMiddleware);

router.post('/create', upload.single('image'), subcategoryController.createSubcategory);
router.get('/all', subcategoryController.getAllSubcategories);
router.get('/get/:id', subcategoryController.getSubcategoryById);
router.put('/update/:id', upload.single('image'), subcategoryController.updateSubcategory);
router.delete('/delete/:id', subcategoryController.deleteSubcategory);

module.exports = router;
