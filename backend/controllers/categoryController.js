const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { deleteImageFromCloudinary } = require('../utils/imageCleanup');

exports.createCategory = async (req, res) => {
    try {
        console.log("CREATE CATEGORY HIT");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const categoryData = { ...req.body };

        if (req.file) {
            categoryData.imageUrl = req.file.path;
        }

        const category = new Category(categoryData);
        await category.save();

        res.status(201).json({
            status: "success",
            data: category
        });
    } catch (error) {
        console.error("CREATE CATEGORY ERROR:", error);
        res.status(500).json({
            message: "Error creating category",
            error: error.message
        });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
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
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        console.log("UPDATE CATEGORY HIT");
        console.log("PARAM ID:", req.params.id);
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const updateData = { ...req.body };

        // If image is uploaded, use Cloudinary URL
        if (req.file) {
            // 🔥 Delete old image if it exists
            const oldCategory = await Category.findById(req.params.id);
            if (oldCategory && oldCategory.imageUrl) {
                await deleteImageFromCloudinary(oldCategory.imageUrl);
            }
            updateData.imageUrl = req.file.path; // cloudinary secure_url
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        console.error("UPDATE CATEGORY ERROR:", error);

        // Cloudinary / Multer error
        if (error.http_code) {
            return res.status(error.http_code).json({
                message: "Image upload failed",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error updating category",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        console.log("DELETE CATEGORY HIT:", req.params.id);

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // 🔥 Delete image from Cloudinary if exists
        if (category.imageUrl) {
            await deleteImageFromCloudinary(category.imageUrl);
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Category and image deleted successfully"
        });

    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error);

        res.status(500).json({
            message: "Error deleting category",
            error: error.message
        });
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

