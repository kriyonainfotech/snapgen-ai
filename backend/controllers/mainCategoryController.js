const MainCategory = require('../models/MainCategory');

exports.createMainCategory = async (req, res) => {
    try {
        const mainCategory = new MainCategory(req.body);
        await mainCategory.save();
        res.status(201).json(mainCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating main category', error: error.message });
    }
};

exports.getAllMainCategories = async (req, res) => {
    try {
        const mainCategories = await MainCategory.find().sort({ createdAt: -1 });
        res.json(mainCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main categories', error: error.message });
    }
};

exports.getMainCategoryById = async (req, res) => {
    try {
        const mainCategory = await MainCategory.findById(req.params.id);
        if (!mainCategory) return res.status(404).json({ message: 'Main category not found' });
        res.json(mainCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching main category', error: error.message });
    }
};

exports.updateMainCategory = async (req, res) => {
    try {
        const mainCategory = await MainCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!mainCategory) return res.status(404).json({ message: 'Main category not found' });
        res.json(mainCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating main category', error: error.message });
    }
};

exports.deleteMainCategory = async (req, res) => {
    try {
        const mainCategory = await MainCategory.findByIdAndDelete(req.params.id);
        if (!mainCategory) return res.status(404).json({ message: 'Main category not found' });
        res.json({ message: 'Main category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting main category', error: error.message });
    }
};
