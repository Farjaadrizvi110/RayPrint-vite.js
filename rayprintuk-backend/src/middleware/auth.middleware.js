const passport = require('passport');
const { sendError } = require('../utils/apiResponse');

/**
 * Middleware — verify JWT and attach req.user.
 */
const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)   return next(err);
    if (!user) return sendError(res, 401, info?.message || 'Unauthorised — invalid or expired token.');
    if (!user.isActive) return sendError(res, 403, 'Your account has been deactivated.');
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware — optionally attach user if JWT is present, but never block the request.
 */
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

module.exports = { protect, optionalAuth };

