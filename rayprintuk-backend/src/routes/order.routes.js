const express = require('express');
const { body } = require('express-validator');
const ctrl    = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin, requirePermission } = require('../middleware/admin.middleware');

const router = express.Router();

const orderItemRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one order item required.'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1.'),
  body('shippingAddress.fullName').trim().notEmpty(),
  body('shippingAddress.line1').trim().notEmpty(),
  body('shippingAddress.city').trim().notEmpty(),
  body('shippingAddress.postcode').trim().notEmpty(),
];

// ─── Customer routes ──────────────────────────────────────────────────────────
router.post('/',         protect, orderItemRules, ctrl.createOrder);
router.get('/',          protect, ctrl.getMyOrders);
router.get('/:id',       protect, ctrl.getOrderById);
router.patch('/:id/cancel', protect, ctrl.cancelOrder);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get('/admin/all',
  protect, isAdmin, requirePermission('manageOrders'),
  ctrl.getAllOrders
);

router.patch('/admin/:id/status',
  protect, isAdmin, requirePermission('manageOrders'),
  [body('status').notEmpty().withMessage('Status is required.')],
  ctrl.updateOrderStatus
);

module.exports = router;

