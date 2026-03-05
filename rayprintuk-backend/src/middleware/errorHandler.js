const logger = require('../utils/logger');

/**
 * Central Express error-handling middleware.
 * Always keep this as the last middleware registered in app.js.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message || 'Internal Server Error';

  // ── Mongoose validation error ──────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // ── Mongoose duplicate key ─────────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // ── Mongoose CastError (invalid ObjectId) ─────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'.`;
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token.'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token has expired.'; }

  // ── CORS error ────────────────────────────────────────────────────────────
  if (message === 'Not allowed by CORS') statusCode = 403;

  // Log only server errors
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
      statusCode,
      stack: err.stack,
      body: req.body,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

