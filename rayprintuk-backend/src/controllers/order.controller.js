const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const {
  sendSuccess,
  sendError,
  paginationMeta,
} = require("../utils/apiResponse");
const {
  sendOrderConfirmation,
  sendOrderDispatchedEmail,
} = require("../utils/emailService");
const logger = require("../utils/logger");

// POST /api/orders/from-payment  — called by frontend after Stripe payment succeeds
// Cart items use static frontend IDs, not MongoDB ObjectIds, so we skip product DB lookup
exports.createOrderFromPayment = async (req, res, next) => {
  try {
    const {
      paymentIntentId,
      items,
      shippingAddress,
      shippingCostPence = 0,
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return sendError(
        res,
        400,
        "Missing required fields: items and shippingAddress."
      );
    }

    // Prevent duplicate orders for the same payment intent
    if (paymentIntentId) {
      const existing = await Order.findOne({
        stripePaymentIntentId: paymentIntentId,
      });
      if (existing)
        return sendSuccess(res, 200, "Order already exists.", existing);
    }

    // Compute totals (all in pence)
    const subtotal = items.reduce(
      (sum, i) => sum + Math.round(i.unitPricePence * i.quantity),
      0
    );
    const tax = Math.round(subtotal * 0.2); // 20% UK VAT
    const totalAmount = subtotal + Math.round(shippingCostPence) + tax;

    const resolvedItems = items.map((item) => ({
      productName: item.name,
      quantity: item.quantity,
      unitPrice: Math.round(item.unitPricePence),
      options: item.options || {},
      artworkUrl: item.artworkUrl || "",
    }));

    const order = await Order.create({
      user: req.user._id,
      items: resolvedItems,
      shippingAddress,
      subtotal,
      shippingCost: Math.round(shippingCostPence),
      tax,
      totalAmount,
      stripePaymentIntentId: paymentIntentId || "",
      paymentStatus: "paid",
      status: "payment_received",
    });

    // Auto-save shipping address to user profile (as default address)
    try {
      const userDoc = await User.findById(req.user._id);
      const defIdx = userDoc.addresses.findIndex((a) => a.isDefault);
      const addrData = { ...shippingAddress, isDefault: true };
      if (defIdx >= 0) {
        Object.assign(userDoc.addresses[defIdx], addrData);
      } else {
        userDoc.addresses.push(addrData);
      }
      await userDoc.save({ validateBeforeSave: false });
    } catch (addrErr) {
      logger.warn("Could not auto-save address to user profile", {
        error: addrErr.message,
      });
    }

    sendOrderConfirmation(req.user, order).catch((e) =>
      logger.warn("Order confirmation email failed", { error: e.message })
    );

    return sendSuccess(res, 201, "Order created.", order);
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return sendError(res, 422, "Validation failed", errors.array());

    const { items, shippingAddress, shippingCost = 0 } = req.body;

    // Validate products and compute totals server-side
    let subtotal = 0;
    const resolvedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive)
        return sendError(res, 400, `Product ${item.product} is unavailable.`);

      const unitPrice = product.basePrice;
      subtotal += unitPrice * item.quantity;
      resolvedItems.push({ ...item, productName: product.name, unitPrice });
    }

    const tax = Math.round(subtotal * 0.2); // 20% UK VAT
    const totalAmount = subtotal + shippingCost + tax;

    const order = await Order.create({
      user: req.user._id,
      items: resolvedItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
    });

    sendOrderConfirmation(req.user, order).catch((e) =>
      logger.warn("Order email failed", { error: e.message })
    );

    return sendSuccess(res, 201, "Order created.", order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders  (my orders)
exports.getMyOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.product", "name slug images"),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      "Orders retrieved.",
      orders,
      paginationMeta(total, page, limit)
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("items.product", "name slug images")
      .populate("items.artwork");
    if (!order) return sendError(res, 404, "Order not found.");
    return sendSuccess(res, 200, "Order retrieved.", order);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) return sendError(res, 404, "Order not found.");
    if (!["pending", "payment_received"].includes(order.status)) {
      return sendError(
        res,
        400,
        `Cannot cancel order in '${order.status}' status.`
      );
    }
    order.status = "cancelled";
    await order.save();
    return sendSuccess(res, 200, "Order cancelled.", order);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, adminNotes, estimatedDelivery } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(adminNotes && { adminNotes }),
        ...(estimatedDelivery && { estimatedDelivery }),
      },
      { new: true, runValidators: true }
    ).populate("user");
    if (!order) return sendError(res, 404, "Order not found.");

    if (status === "dispatched") {
      sendOrderDispatchedEmail(order.user, order).catch((e) =>
        logger.warn("Dispatch email failed", { error: e.message })
      );
    }

    return sendSuccess(res, 200, "Order status updated.", order);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/orders  (admin — all orders)
exports.getAllOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.user) filter.user = req.query.user;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "firstName lastName email"),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      "All orders retrieved.",
      orders,
      paginationMeta(total, page, limit)
    );
  } catch (err) {
    next(err);
  }
};
