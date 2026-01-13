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


        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });


        return res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Login error', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (email) admin.email = email;
        if (password) admin.password = password;

        await admin.save();
        res.json({ message: 'Profile updated successfully', email: admin.email });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error: error.message });
    }
};

exports.updateAdminPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.password = password;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = new Admin({ email, password });
        await admin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (email) admin.email = email;
        if (password) admin.password = password;

        await admin.save();
        res.json({ message: 'Admin updated successfully', email: admin.email });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if this is the last admin
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 1) {
            return res.status(400).json({ message: 'Cannot delete the last admin account.' });
        }

        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
};
