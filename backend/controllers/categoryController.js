const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error creating category', error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        console.log(req.params); // { type: 'image' }

        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

exports.getCategoriesByType = async (req, res) => {
    try {
        console.log(req.params); // { type: 'image' }

        const { type } = req.params;
        const filter = type ? { type } : {};

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 });

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};


exports.getNestedCategories = async (req, res) => {
    try {
        const [categories, subcategories] = await Promise.all([
            Category.find().sort({ createdAt: -1 }),
            Subcategory.find().sort({ createdAt: -1 })
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
            message: 'Error fetching nested categories',
            error: error.message
        });
    }
};
