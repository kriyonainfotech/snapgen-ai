const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'snapgen@admin.com';
        const adminPassword = '@snapgen';

        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = new Admin({
                email: adminEmail,
                password: adminPassword
            });
            await admin.save();
            console.log('✅ Default admin account created: snapgen@admin.com');
        } else {
            console.log('ℹ️ Admin account already exists');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
