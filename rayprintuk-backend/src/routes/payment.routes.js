const express = require('express');
const { body } = require('express-validator');
const ctrl    = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin, requirePermission } = require('../middleware/admin.middleware');

const router = express.Router();

// NOTE: /webhook must use raw body — registered before json() in app.js
router.post('/webhook', ctrl.handleWebhook);

// ─── Customer routes ──────────────────────────────────────────────────────────
router.post('/create-intent',
  protect,
  [body('orderId').isMongoId().withMessage('Valid order ID required.')],
  ctrl.createPaymentIntent
);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post('/refund',
  protect, isAdmin, requirePermission('manageOrders'),
  [
    body('orderId').isMongoId(),
    body('amount').optional().isInt({ min: 1 }),
  ],
  ctrl.refundPayment
);

module.exports = router;

