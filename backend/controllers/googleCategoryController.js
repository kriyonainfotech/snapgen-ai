const GoogleCategory = require('../models/GoogleCategory');
const GoogleSubcategory = require('../models/GoogleSubcategory');
const { deleteImageFromCloudinary } = require('../utils/imageCleanup');

exports.createCategory = async (req, res) => {
    try {
        const categoryData = { ...req.body };
        if (req.file) {
            categoryData.imageUrl = req.file.path;
        }
        const category = new GoogleCategory(categoryData);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error creating google category', error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await GoogleCategory.find()
            .sort({ createdAt: -1 });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching google categories',
            error: error.message
        });
    }
};

exports.getCategoriesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const filter = type ? { type } : {};

        const categories = await GoogleCategory.find(filter)
            .sort({ createdAt: -1 });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching google categories',
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await GoogleCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Google Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching google category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            const oldCategory = await GoogleCategory.findById(req.params.id);
            if (oldCategory && oldCategory.imageUrl) {
                await deleteImageFromCloudinary(oldCategory.imageUrl);
            }
            updateData.imageUrl = req.file.path;
        }
        const category = await GoogleCategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: 'Google Category not found' });
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error updating google category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await GoogleCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Google Category not found' });

        if (category.imageUrl) {
            await deleteImageFromCloudinary(category.imageUrl);
        }

        await GoogleCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Google Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting google category', error: error.message });
    }
};


exports.getNestedCategories = async (req, res) => {
    try {
        const [categories, subcategories] = await Promise.all([
            GoogleCategory.find().sort({ createdAt: -1 }),
            GoogleSubcategory.find().sort({ createdAt: -1 })
        ]);

        const nestedData = {
            image: [],
            video: []
        };

        categories.forEach(cat => {
            const catSubcategories = subcategories.filter(sub =>
                sub.category.toString() === cat._id.toString()
            );

            const catData = {
                ...cat.toObject(),
                subcategories: catSubcategories
            };

            if (cat.type === 'image') {
                nestedData.image.push(catData);
            } else if (cat.type === 'video') {
                nestedData.video.push(catData);
            }
        });

        res.json({
            status: 'success',
            data: nestedData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching nested google categories',
            error: error.message
        });
    }
};
