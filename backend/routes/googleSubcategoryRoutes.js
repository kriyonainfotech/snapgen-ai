const express = require('express');
const router = express.Router();
const googleSubcategoryController = require('../controllers/googleSubcategoryController');

router.post('/create', googleSubcategoryController.createSubcategory);
router.get('/all', googleSubcategoryController.getAllSubcategories);
router.get('/get/:id', googleSubcategoryController.getSubcategoryById);
router.put('/update/:id', googleSubcategoryController.updateSubcategory);
router.delete('/delete/:id', googleSubcategoryController.deleteSubcategory);

module.exports = router;
