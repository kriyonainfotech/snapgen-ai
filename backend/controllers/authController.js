const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json({
                message: 'Invalid request',
                error: 'Request body or email is missing'
            });
        }
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = new Admin({ email, password });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1d'
        });

        console.log(token, "token");

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        console.log("Status:", res.statusCode);

        return res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Login error', error: error.message });
    }
};
