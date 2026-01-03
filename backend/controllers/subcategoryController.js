const Subcategory = require('../models/Subcategory');

exports.createSubcategory = async (req, res) => {
    try {
        const subcategory = new Subcategory(req.body);
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(400).json({ message: 'Error creating subcategory', error: error.message });
    }
};

exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category').sort({ createdAt: -1 });
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
};

exports.getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category');
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
    }
};

exports.updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.json(subcategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating subcategory', error: error.message });
    }
};

exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
    }
};
