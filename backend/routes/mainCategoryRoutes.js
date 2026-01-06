const express = require('express');
const router = express.Router();
const mainCategoryController = require('../controllers/mainCategoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/create', mainCategoryController.createMainCategory);
router.get('/all', mainCategoryController.getAllMainCategories);
router.get('/get/:id', mainCategoryController.getMainCategoryById);
router.put('/update/:id', mainCategoryController.updateMainCategory);
router.delete('/delete/:id', mainCategoryController.deleteMainCategory);

module.exports = router;
