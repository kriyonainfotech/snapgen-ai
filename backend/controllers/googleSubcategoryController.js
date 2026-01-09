const GoogleSubcategory = require('../models/GoogleSubcategory');

exports.createSubcategory = async (req, res) => {
    try {
        const subcategory = new GoogleSubcategory(req.body);
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating google subcategory', error: error.message });
    }
};

exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await GoogleSubcategory.find().populate('category').sort({ createdAt: -1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching google subcategories', error: error.message });
    }
};

exports.getSubcategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await GoogleSubcategory.find({ category: id }).populate('category');
        if (!subcategory) return res.status(404).json({ message: 'Google Subcategory not found' });
        return res.json({ success: true, subcategory });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching google subcategory', error: error.message });
    }
};

exports.updateSubcategory = async (req, res) => {
    try {
        const subcategory = await GoogleSubcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subcategory) return res.status(404).json({ message: 'Google Subcategory not found' });
        res.json(subcategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating google subcategory', error: error.message });
    }
};

exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await GoogleSubcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Google Subcategory not found' });
        res.json({ message: 'Google Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting google subcategory', error: error.message });
    }
};
