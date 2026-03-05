const User   = require('../models/User');
const Admin  = require('../models/Admin');
const Order  = require('../models/Order');
const Product = require('../models/Product');
const Artwork = require('../models/Artwork');
const { sendSuccess, sendError, paginationMeta } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalOrders, totalProducts,
      pendingArtwork, revenue, recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Artwork.countDocuments({ status: 'uploaded' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email'),
    ]);

    return sendSuccess(res, 200, 'Dashboard stats.', {
      totalUsers,
      totalOrders,
      totalProducts,
      pendingArtwork,
      totalRevenue: revenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) { next(err); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;
    const filter = { role: 'customer' };
    if (req.query.search) filter.$or = [
      { email:     { $regex: req.query.search, $options: 'i' } },
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName:  { $regex: req.query.search, $options: 'i' } },
    ];

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Users retrieved.', users, paginationMeta(total, page, limit));
  } catch (err) { next(err); }
};

// PATCH /api/admin/users/:id/toggle-active
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');
    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}.`, user);
  } catch (err) { next(err); }
};

// POST /api/admin/bootstrap — Create first super-admin (secured with secret)
exports.bootstrapAdmin = async (req, res, next) => {
  try {
    const { email, secret } = req.body;
    if (secret !== process.env.ADMIN_SECRET) return sendError(res, 403, 'Invalid admin secret.');

    const user = await User.findOne({ email });
    if (!user) return sendError(res, 404, 'User not found. Register first.');

    const existing = await Admin.findOne({ user: user._id });
    if (existing) return sendError(res, 409, 'Admin already exists.');

    user.role = 'admin';
    await user.save();

    const admin = await Admin.create({ user: user._id, isSuperAdmin: true });
    return sendSuccess(res, 201, 'Super-admin created.', { admin, user });
  } catch (err) { next(err); }
};

// GET /api/admin/analytics/revenue
exports.getRevenueAnalytics = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const since  = new Date();
    since.setMonth(since.getMonth() - months);

    const data = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: since } } },
      { $group: {
        _id:      { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue:  { $sum: '$totalAmount' },
        orders:   { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return sendSuccess(res, 200, 'Revenue analytics.', data);
  } catch (err) { next(err); }
};

