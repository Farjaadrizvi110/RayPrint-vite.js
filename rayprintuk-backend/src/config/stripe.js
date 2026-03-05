const Stripe = require('stripe');
const logger = require('../utils/logger');

if (!process.env.STRIPE_SECRET_KEY) {
  logger.warn('⚠️  STRIPE_SECRET_KEY is not set — payment features will not work.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  telemetry: false,
});

module.exports = stripe;

