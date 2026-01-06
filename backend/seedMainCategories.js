require('dotenv').config();
const mongoose = require('mongoose');
const MainCategory = require('./models/MainCategory');
const connectDB = require('./config/db');

const seedMainCategories = async () => {
    try {
        await connectDB();

        // Clear existing
        await MainCategory.deleteMany();

        const mainCategories = [
            { title: 'image' },
            { title: 'video' }
        ];

        await MainCategory.insertMany(mainCategories);
        console.log('Main categories seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding main categories:', error);
        process.exit(1);
    }
};

seedMainCategories();
