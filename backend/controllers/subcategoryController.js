const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { deleteImageFromCloudinary } = require('../utils/imageCleanup');

exports.createSubcategory = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = req.file.path;
        }
        const subcategory = new Subcategory(data);
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
        const { id } = req.params;
        const subcategory = await Subcategory.find({ category: id }).populate('category');
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        return res.json({ success: true, subcategory });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategory', error: error.message });
    }
};

exports.updateSubcategory = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            const oldSubcategory = await Subcategory.findById(req.params.id);
            if (oldSubcategory && oldSubcategory.image) {
                await deleteImageFromCloudinary(oldSubcategory.image);
            }
            data.image = req.file.path;
        }
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.json(subcategory);
    } catch (error) {
        res.status(400).json({ message: 'Error updating subcategory', error: error.message });
    }
};

exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        if (subcategory.image) {
            await deleteImageFromCloudinary(subcategory.image);
        }

        await Subcategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
    }
};
