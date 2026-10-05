require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore
}

const seedAdmin = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);

    // Remove legacy admin if present
    await Admin.deleteMany({ email: 'admin@graphicshaven.in' });

    const email = 'graphicshaven4@gmail.com';
    const password = 'Unicorn@1891';

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.password = password;
      await admin.save();
      console.log(`[Seed] Updated existing admin password for: ${email}`);
    } else {
      admin = await Admin.create({
        name: 'Studio Creative Director',
        email,
        password,
        role: 'superadmin',
      });
      console.log(`[Seed] Created new admin account for: ${email}`);
    }

    console.log('----------------------------------------------------');
    console.log('Admin Account Configured Successfully!');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     ${admin.role}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedAdmin();
