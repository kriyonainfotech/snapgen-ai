const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ message: 'deviceId is required' });
        }

        // Use findOneAndUpdate with upsert: true to handle both create and update
        const user = await User.findOneAndUpdate(
            { deviceId },
            { $set: req.body },
            {
                new: true, // Return the modified document
                upsert: true, // Create a new document if it doesn't exist
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        const status = user.wasNew ? 201 : 200; // Note: wasNew isn't standard in findOneAndUpdate, but we can check records or just return 200/201
        console.log("user", status, user);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error processing user', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        console.log("users", users);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
