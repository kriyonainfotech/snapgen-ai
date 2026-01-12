// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const googleCategoryRoutes = require('./routes/googleCategoryRoutes');
const googleSubcategoryRoutes = require('./routes/googleSubcategoryRoutes');
const mainCategoryRoutes = require('./routes/mainCategoryRoutes');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', "https://snapgenai.vercel.app"],
    credentials: true
}));

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/google-categories', googleCategoryRoutes);
app.use('/api/google-subcategories', googleSubcategoryRoutes);
app.use('/api/main-categories', mainCategoryRoutes);

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        message: "Internal Server Error",
        error: err.message || err
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});