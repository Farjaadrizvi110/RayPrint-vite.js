const Admin = require('../models/Admin');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware — ensure the authenticated user is an admin.
 * Must be used AFTER protect middleware.
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorised.');

    if (req.user.role !== 'admin') {
      return sendError(res, 403, 'Forbidden — admin access required.');
    }

    const adminRecord = await Admin.findOne({ user: req.user._id });
    if (!adminRecord) return sendError(res, 403, 'Forbidden — admin record not found.');

    req.admin = adminRecord;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware — ensure the admin is a super-admin.
 * Must be used AFTER isAdmin middleware.
 */
const isSuperAdmin = (req, res, next) => {
  if (!req.admin?.isSuperAdmin) {
    return sendError(res, 403, 'Forbidden — super-admin access required.');
  }
  next();
};

/**
 * Factory — check a specific admin permission.
 * @param {string} permission - key from Admin.permissions
 */
const requirePermission = (permission) => (req, res, next) => {
  if (req.admin?.isSuperAdmin) return next();
  if (!req.admin?.permissions?.[permission]) {
    return sendError(res, 403, `Forbidden — you lack the '${permission}' permission.`);
  }
  next();
};

module.exports = { isAdmin, isSuperAdmin, requirePermission };

