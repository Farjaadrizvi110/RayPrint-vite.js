const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  permissions: {
    manageProducts: { type: Boolean, default: true },
    manageOrders:   { type: Boolean, default: true },
    manageUsers:    { type: Boolean, default: false },
    manageAdmins:   { type: Boolean, default: false },
    viewAnalytics:  { type: Boolean, default: true },
  },
  isSuperAdmin: { type: Boolean, default: false },
  lastLogin:    { type: Date },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);

