const Stripe = require("stripe");
const logger = require("../utils/logger");

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn(
    "⚠️  STRIPE_SECRET_KEY is not set — payment features will not work.",
  );
}

// Use a placeholder key when not set so the server starts without crashing.
// All Stripe API calls will still fail — but with a proper JSON error, not a server crash.
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_placeholder_not_set",
  {
    apiVersion: "2024-06-20",
    telemetry: false,
  },
);

module.exports = stripe;
