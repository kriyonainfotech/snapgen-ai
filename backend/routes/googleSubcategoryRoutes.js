const express = require('express');
const router = express.Router();
const googleSubcategoryController = require('../controllers/googleSubcategoryController');
const { upload } = require('../utils/cloudinary');

router.post('/create', upload.single('image'), googleSubcategoryController.createSubcategory);
router.get('/all', googleSubcategoryController.getAllSubcategories);
router.get('/get/:id', googleSubcategoryController.getSubcategoryById);
router.put('/update/:id', upload.single('image'), googleSubcategoryController.updateSubcategory);
router.delete('/delete/:id', googleSubcategoryController.deleteSubcategory);

module.exports = router;
