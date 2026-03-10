/**
 * Run once to create the admin user in MongoDB.
 * Usage: node scripts/seedAdmin.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User     = require('../src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const email    = process.env.ADMIN_EMAIL   || 'admin@rayprintuk.com';
    const password = process.env.ADMIN_SECRET  || 'admin@bilal555';

    const existing = await User.findOne({ email });
    if (existing) {
      // Update password + role in case they changed
      existing.password  = password;   // pre-save hook will re-hash it
      existing.role      = 'admin';
      existing.isActive  = true;
      existing.isVerified = true;
      await existing.save();
      console.log(`✅  Admin user updated: ${email}`);
    } else {
      await User.create({
        email,
        password,
        firstName : 'Admin',
        lastName  : 'RayPrint',
        role      : 'admin',
        isVerified: true,
        isActive  : true,
      });
      console.log(`✅  Admin user created: ${email}`);
    }

    await mongoose.disconnect();
    console.log('✅  Done.');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
})();

