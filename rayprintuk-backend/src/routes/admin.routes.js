const express = require('express');
const { body } = require('express-validator');
const ctrl    = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin, isSuperAdmin, requirePermission } = require('../middleware/admin.middleware');

const router = express.Router();

// ─── Bootstrap (no auth — protected by secret) ───────────────────────────────
router.post('/bootstrap', [
  body('email').isEmail().normalizeEmail(),
  body('secret').notEmpty(),
], ctrl.bootstrapAdmin);

// ─── All routes below require authentication + admin ─────────────────────────
router.use(protect, isAdmin);

router.get('/dashboard', requirePermission('viewAnalytics'), ctrl.getDashboardStats);
router.get('/analytics/revenue', requirePermission('viewAnalytics'), ctrl.getRevenueAnalytics);

router.get('/users',           requirePermission('manageUsers'), ctrl.getUsers);
router.patch('/users/:id/toggle-active', requirePermission('manageUsers'), ctrl.toggleUserActive);

module.exports = router;

