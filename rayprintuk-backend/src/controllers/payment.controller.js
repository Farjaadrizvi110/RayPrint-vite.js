const stripe = require("../config/stripe");
const Order = require("../models/Order");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const logger = require("../utils/logger");

// POST /api/payments/checkout-intent  — create payment intent directly from cart (no order ID needed)
exports.createCheckoutIntent = async (req, res, next) => {
  try {
    const {
      amountPence,
      currency = "gbp",
      items = [],
      customerEmail,
    } = req.body;
    if (!amountPence || amountPence < 30) {
      return sendError(res, 400, "Amount must be at least 30 pence.");
    }

    // Ensure/create Stripe customer
    let stripeCustomerId = req.user?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: customerEmail || req.user?.email,
        name: req.user
          ? `${req.user.firstName} ${req.user.lastName}`
          : customerEmail,
        metadata: req.user ? { userId: String(req.user._id) } : {},
      });
      stripeCustomerId = customer.id;
      if (req.user) {
        await User.findByIdAndUpdate(req.user._id, { stripeCustomerId });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountPence),
      currency,
      customer: stripeCustomerId,
      receipt_email: customerEmail || req.user?.email,
      description: `RayPrint UK — ${items.length} item(s)`,
      metadata: {
        userId: req.user ? String(req.user._id) : "guest",
        itemCount: String(items.length),
        itemsSummary: items
          .map((i) => `${i.name} x${i.quantity}`)
          .join(", ")
          .slice(0, 499),
      },
      automatic_payment_methods: { enabled: true },
    });

    return sendSuccess(res, 200, "Payment intent created.", {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/create-intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return sendError(res, 404, "Order not found.");
    if (order.paymentStatus === "paid")
      return sendError(res, 400, "Order already paid.");

    // Ensure user has a Stripe customer ID
    let { stripeCustomerId } = req.user;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.fullName,
        metadata: { userId: String(req.user._id) },
      });
      stripeCustomerId = customer.id;
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount, // already in pence
      currency: order.currency || "gbp",
      customer: stripeCustomerId,
      metadata: {
        orderId: String(order._id),
        orderNumber: order.orderNumber,
        userId: String(req.user._id),
      },
      automatic_payment_methods: { enabled: true },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    return sendSuccess(res, 200, "Payment intent created.", {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/webhook  — raw body required (set in app.js)
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.warn("Stripe webhook signature verification failed", {
      error: err.message,
    });
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const order = await Order.findOne({ stripePaymentIntentId: pi.id });
        if (order) {
          order.paymentStatus = "paid";
          order.status = "payment_received";
          order.stripeChargeId = pi.latest_charge || "";
          await order.save();
          logger.info(`Payment succeeded for order ${order.orderNumber}`);
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const order = await Order.findOne({ stripePaymentIntentId: pi.id });
        if (order) {
          order.paymentStatus = "failed";
          await order.save();
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const order = await Order.findOne({ stripeChargeId: charge.id });
        if (order) {
          order.paymentStatus = "refunded";
          order.status = "refunded";
          await order.save();
        }
        break;
      }
      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("Webhook handler error", { error: err.message });
    res.status(500).json({ error: "Internal webhook processing error." });
  }
};

// POST /api/payments/refund  (admin)
exports.refundPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 404, "Order not found.");
    if (!order.stripeChargeId)
      return sendError(res, 400, "No charge found for this order.");

    const refund = await stripe.refunds.create({
      charge: order.stripeChargeId,
      ...(amount && { amount }),
    });

    logger.info(`Refund issued for order ${order.orderNumber}`, {
      refundId: refund.id,
    });
    return sendSuccess(res, 200, "Refund processed.", {
      refundId: refund.id,
      status: refund.status,
    });
  } catch (err) {
    next(err);
  }
};
