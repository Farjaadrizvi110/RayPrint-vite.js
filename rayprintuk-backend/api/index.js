'use strict';
require('dotenv').config();

const app        = require('../src/app');
const connectDB  = require('../src/config/db');
const logger     = require('../src/utils/logger');
const User       = require('../src/models/User');
const Admin      = require('../src/models/Admin');

// ── MongoDB connection is cached across warm Vercel invocations ──────────────
let isConnected = false;

async function seedAdmin() {
  try {
    const email    = process.env.ADMIN_EMAIL    || 'admin@rayprintuk.com';
    const password = process.env.ADMIN_SECRET   || 'admin@bilal555';

    let userDoc = await User.findOne({ email });
    if (userDoc) {
      userDoc.role       = 'admin';
      userDoc.isActive   = true;
      userDoc.isVerified = true;
      userDoc.password   = password;
      await userDoc.save();
      logger.info(`Admin synced: ${email}`);
    } else {
      userDoc = await User.create({
        email, password,
        firstName: 'Admin', lastName: 'RayPrint',
        role: 'admin', isVerified: true, isActive: true,
      });
      logger.info(`Admin created: ${email}`);
    }

    const adminRecord = await Admin.findOne({ user: userDoc._id });
    if (!adminRecord) {
      await Admin.create({
        user: userDoc._id,
        isSuperAdmin: true,
        permissions: {
          manageProducts: true, manageOrders: true, manageUsers: true,
          manageAdmins: true,   viewAnalytics: true,
        },
      });
      logger.info('Admin record created (super-admin).');
    }
  } catch (err) {
    logger.error('seedAdmin failed', { error: err.message });
  }
}

async function ensureConnected() {
  if (isConnected) return;
  await connectDB();
  await seedAdmin();
  isConnected = true;
}

// ── Vercel calls this function for every incoming request ────────────────────
module.exports = async (req, res) => {
  await ensureConnected();
  return app(req, res);
};

